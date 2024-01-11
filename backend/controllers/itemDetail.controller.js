const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const ItemDetail = db.itemDetail
const TransactionDetail = db.transactionDetail
const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Item Detail
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.unit) {
        res.status(400).send({
            message: "Supplier can not be empty!"
        });
        return;
    }

    // Save Item Detail in the database
    ItemDetail.create(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Item Detail."
            });
        });
};

// Retrieve all Item detail from the database.
exports.findAll = (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "unit";
    let total = null
    let filterCategory = req.query.category || "All";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    const categoryOption = [
        "Laptop",
        "HP",
        "Monitor",
        "TV",
        "AC",
        "Projektor",
    ];

    filterCategory === "All" ? filterCategory = [...categoryOption] : filterCategory = req.query.category.split(",");

    var condition = req.query.search ? { name: { [Op.iLike]: `%${req.query.search}%` } } : null;

    condition = req.query.category && condition ? { ...condition, category: { [Op.or]: filterCategory } } : condition ? condition : req.query.category ? { category: { [Op.or]: filterCategory } } : null;

    ItemDetail.count({
        include: [{
            where: condition,
            model: Item,
            as: 'item',
        }]
    })
        .then(totalData => total = totalData)
        .catch(err => {
            res.status(500).send({
                msg: err.message || "Some error occurred while retrieving item."
            });
        });

    ItemDetail.findAll({
        offset: page * limit,
        limit: limit,
        order: [sort],
        include: [{
            where: condition,
            model: Item,
            required: true,
            attributes: ['name', 'category', 'merk'],
            as: 'item',
        }]
    })
        .then(items => {
            res.send({
                page,
                limit,
                items,
                total,
                category: categoryOption
            });
        })
        .catch(err => {
            res.status(500).send({
                msg: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Retrieve all Item Detail without pagination from the database.
exports.list = (req, res) => {
    const ItemId = req.query.itemId;
    var condition = ItemId ? { itemId: { [Op.iLike]: `%${ItemId}%` } } : null;

    ItemDetail.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving item detail."
            });
        });
};

// Find a single Item Detail with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    ItemDetail.findOne({
        where: {
            id: id
        },
        include: [{
            model: Item,
            attributes: ['name'],
            as: 'item', // Specify the alias for the association
        }]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Item Detail with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Item Detail with id=" + id
            });
        });
};

// Update a Item Detail by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    ItemDetail.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Item Detail was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Item Detail with id=${id}. Maybe Item Detail was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Item Detail with id=" + id
            });
        });
};

// Delete a Item Detail with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    TransactionDetail.findAll({
        where: {
            itemDetailId: { [Op.iLike]: req.params.id },
        }
    })
        .then(async dataTransactionDetail => {
            if (dataTransactionDetail.length > 0) {
                res.status(402).send({
                    msg: "This Unit is use in transaction!"
                });
            } else {
                ItemDetail.destroy({
                    where: { id: id }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "ItemDetail was deleted successfully!"
                            });
                        } else {
                            res.send({
                                message: `Cannot delete Item Detail with id=${id}. Maybe Item Detail was not found!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Could not delete Item Detail with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving transaction detail."
            });
        });
};