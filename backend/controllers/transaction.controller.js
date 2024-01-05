const { Sequelize } = require('sequelize');

const db = require("../models");

const Transaction = db.transaction;
const TransactionDetail = db.transactionDetail;
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
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "createdAt";
    let total = null
    let filterType = req.query.type || "All";
    let filterStatus = req.query.status || "All";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    const typeOption = [
        "In",
        "Out",
    ];

    const statusOption = [
        "Inisialization",
        "Ready to Check",
        "On Check",
        "Success",
        "Success with Return",
        "Canceled",
    ];

    filterType === "All" ? filterType = [...typeOption] : filterType = req.query.type.split(",");
    filterStatus === "All" ? filterStatus = [...statusOption] : filterStatus = req.query.status.split(",");

    var condition = req.query.search ? { secondParty: { [Op.iLike]: `%${req.query.search}%` } } : null;
    condition = req.query.type && condition ? { ...condition, type: { [Op.or]: filterType } } : condition ? condition : req.query.type ? { type: { [Op.or]: filterType } } : null;
    condition = req.query.status && condition ? { ...condition, status: { [Op.or]: filterStatus } } : condition ? condition : req.query.status ? { status: { [Op.or]: filterStatus } } : null;

    if (req.query.startDate && req.query.endDate) {
        let startDate = new Date(req.query.startDate);
        startDate = startDate.toISOString().split('T')[0];

        let endDate = new Date(req.query.endDate);
        endDate = endDate.setDate(endDate.getDate() + 1)
        let newEndDate = new Date(endDate)
        newEndDate = newEndDate.toISOString().split('T')[0];
        
        condition = {
            ...condition,
            createdAt: {
                [Op.between]: [startDate, newEndDate],
            },
        };
    } else if (req.query.month && req.query.year) {
        const firstDayOfMonth = new Date(req.query.year, req.query.month - 1, 1);
        const lastDayOfMonth = new Date(req.query.year, req.query.month, 0);

        condition = {
            ...condition,
            createdAt: {
                [Op.gte]: firstDayOfMonth,
                [Op.lt]: lastDayOfMonth,
            },
        };
    }

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
            {
                model: User,
                attributes: ['name'],
                as: 'userWarehouse',
            },
        ]
    })
        .then(transactions => {
            res.send({
                page,
                limit,
                transactions,
                total,
                type: typeOption,
                status: statusOption
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
            {
                model: User,
                attributes: ['name', 'role'],
                as: 'userWarehouse', // Specify the alias for the association
            }
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
exports.update = async (req, res) => {
    const id = req.params.id;

    req.body.status === 'On Check' ? req.body.pocWarehouse = req.user.id : null;

    if (req.body.status === 'Done') {
        await TransactionDetail.findAll({
            where: {
                transactionId: { [Op.iLike]: id }
            },
        })
            .then(dataTransactionDetails => {
                const isNotDone = dataTransactionDetails.some(TransactionDetail => TransactionDetail.status === 'Ready to Check')
                if (isNotDone) {
                    return res.status(401).send({
                        msg: `Transaction canot be done. Because in this transaction have item not validated!`
                    });
                }
                const isAccept = dataTransactionDetails.every(TransactionDetail => TransactionDetail.status === 'Accept')
                const isCancel = dataTransactionDetails.every(TransactionDetail => TransactionDetail.status === 'Cancel')
                req.body.status = isAccept ? 'Success' : isCancel ? 'Canceled' : 'Success with Return'
            })
            .catch(err => {
                res.status(500).send({
                    msg:
                        err.message || "Some error occurred while retrieving transaction detail."
                });
                return;
            });
    }

    if (req.body.status !== 'Done') {
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
    }

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
