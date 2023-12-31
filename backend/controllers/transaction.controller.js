const { Sequelize } = require('sequelize');

const db = require("../models");

const Transaction = db.transaction;
const User = db.user;
const Op = Sequelize.Op;

// Create and Save a new Transaction
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.secondParty) {
        res.status(400).send({
            msg: (req.body.type === 'In' ? 'Suplyer' : 'Customer') + " can not be empty!"
        });
        return;
    }

    // Save Transaction in the database
    Transaction.create({ ...req.body, pocOffice: req.user.id })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while creating the Transaction."
            });
        });
};

// Retrieve all Transaction from the database.
exports.findAll = (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 3;
    let sort = req.query.sort || "createdAt";
    let total = null
    let filterType = req.query.type || "All";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    const typeOption = [
        "In",
        "Out",
    ];

    filterType === "All" ? filterType = [...typeOption] : filterType = req.query.type.split(",");

    var condition = req.query.search ? { secondParty: { [Op.iLike]: `%${req.query.search}%` } } : null;
    condition = req.query.type && condition ? { ...condition, type: { [Op.or]: filterType } } : condition ? condition : req.query.type ? { type: { [Op.or]: filterType } } : null;

    Transaction.count({
        where: condition
    })
        .then(totalData => total = totalData)
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving item."
            });
        });

    Transaction.findAll({
        where: condition,
        offset: page * limit,
        limit: limit,
        order: [sort],
        include: [
            {
                model: User,
                attributes: ['name'],
                as: 'userOffice',
            },
        ]
    })
        .then(transactions => {
            res.send({
                page,
                limit,
                transactions,
                total,
                type: typeOption
            });
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving transaction."
            });
        });
};

// Find a single Transaction with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Transaction.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: User,
                attributes: ['name', 'role'],
                as: 'userOffice', // Specify the alias for the association
            },
            // {
            //     model: User,
            //     attributes: ['name', 'role'],
            //     as: 'userOffice', // Specify the alias for the association
            // }
        ]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    msg: `Cannot find Transaction with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error retrieving Transaction with id=" + id
            });
        });
};

// Update a Transaction by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Transaction.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    msg: "Transaction was updated successfully."
                });
            } else {
                res.send({
                    msg: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error updating Transaction with id=" + id
            });
        });
};

// Delete a Transaction with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Transaction.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    msg: "Transaction was deleted successfully!"
                });
            } else {
                res.send({
                    msg: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Could not delete Transaction with id=" + id
            });
        });
};
