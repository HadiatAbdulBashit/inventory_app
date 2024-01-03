const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const TransactionDetail = db.transactionDetail
const Transaction = db.transaction;
const ItemDetail = db.itemDetail;
const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Transaction Detail
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.totalItem || req.body.totalItem === 0) {
        res.status(400).send({
            msg: "Total item can not be empty!"
        });
        return;
    }

    let condition = {
        itemDetailId: { [Op.iLike]: req.body.itemDetailId },
        transactionId: { [Op.iLike]: req.body.transactionId }
    };

    let price = null;
    let oldPrice = null;
    let updateStock = null;

    ItemDetail.findOne({
        where: { id: req.body.itemDetailId }
    })
        .then(data => {
            if (data) {
                price = data.price * req.body.totalItem
                updateStock = data.stock - req.body.totalItem
            } else {
                res.status(404).send({
                    msg: `Cannot find Item Detail with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error retrieving Item Detail with id=" + id
            });
        });

    Transaction.findOne({
        where: { id: req.body.transactionId }
    })
        .then(data => {
            if (data) {
                oldPrice = data.totalPrice
            } else {
                res.status(404).send({
                    msg: `Cannot find Item Detail with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error retrieving Item Detail with id=" + id
            });
        });

    TransactionDetail.findAll({
        where: condition,
    })
        .then(data => {
            if (data.length > 0) {
                res.status(401).send({
                    msg: "Theres same item and unit on this transaction!"
                });
            } else {
                // Save Transaction Detail in the database
                TransactionDetail.create(req.body)
                    .then(data => {
                        Transaction.update({ totalPrice: price + oldPrice }, {
                            where: { id: req.body.transactionId }
                        })
                            .then(num => {
                                if (num < 1) {
                                    res.send({
                                        msg: `Cannot update Transaction with id = ${req.body.transactionId}. Maybe Transaction was not found or request is empty!`
                                    });
                                }
                            })
                            .catch(err => {
                                res.status(500).send({
                                    msg: "Error updating Transaction with id = " + req.body.transactionId
                                });
                            });
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            msg:
                                err.message || "Some error occurred while creating the Transaction Detail."
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

// Retrieve all Transaction Detail from the database.
exports.findAll = (req, res) => {
    var condition = req.query.transactionId ? { transactionId: { [Op.iLike]: `%${req.query.transactionId}%` } } : null;

    TransactionDetail.findAll({
        where: condition,
        order: [['createdAt', 'desc']],
        include: [{
            model: ItemDetail,
            attributes: ['unit', 'price'],
            as: 'itemDetail', // Specify the alias for the association
            include: [{
                model: Item,
                attributes: ['name', 'merk'],
                as: 'item', // Specify the alias for the association
            }]
        }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving transaction detail."
            });
        });
};

// Find a single Transaction Detail with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    TransactionDetail.findOne({
        where: {
            id: id
        },
        include: [{
            model: ItemDetail,
            attributes: ['unit', 'price'],
            as: 'itemDetail', // Specify the alias for the association
            include: [{
                model: Item,
                attributes: ['name'],
                as: 'item', // Specify the alias for the association
            }]
        }]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    msg: `Cannot find Transaction Detail with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error retrieving Transaction Detail with id=" + id
            });
        });
};

// Update a Transaction Detail by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    TransactionDetail.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    msg: "Transaction Detail was updated successfully."
                });
            } else {
                res.send({
                    msg: `Cannot update Transaction Detail with id=${id}. Maybe Transaction Detail was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error updating Transaction Detail with id=" + id
            });
        });
};

// Delete a Transaction Detail with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    TransactionDetail.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    msg: "TransactionDetail was deleted successfully!"
                });
            } else {
                res.send({
                    msg: `Cannot delete Transaction Detail with id=${id}. Maybe Transaction Detail was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Could not delete Transaction Detail with id=" + id
            });
        });
};