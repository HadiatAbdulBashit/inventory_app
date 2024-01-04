const { Sequelize } = require('sequelize');

const db = require("../models");

const ReturnItem = db.returnItem;
const TransactionDetail = db.transactionDetail
const ItemDetail = db.itemDetail;
const Item = db.item;
const Sale = db.sale;
const Op = Sequelize.Op;

// Create and Save a new ReturnItem
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.totalItem || req.body.totalItem === 0) {
        res.status(400).send({
            msg: "Total item can not be empty!"
        });
        return;
    }

    ReturnItem.findAll({
        where: { transactionDetailId: { [Op.iLike]: req.body.transactionDetailId } },
    })
        .then(dataReturnItem => {
            // Validation if return have same detail transaction
            if (dataReturnItem.length > 0) {
                res.status(401).send({
                    msg: "Theres same return in this items transaction!"
                });
            } else {

                TransactionDetail.findOne({
                    where: {
                        id: req.body.transactionDetailId
                    }
                })
                    .then(dataTransactionDetail => {
                        if (dataTransactionDetail) {
                            const totalItemWant = dataTransactionDetail.totalItem

                            // Save ReturnItem in the database
                            ReturnItem.create(req.body)
                                .then(data => {

                                    TransactionDetail.update({ status: totalItemWant === req.body.totalItem ? 'Cancel' : 'Accept with Return' }, {
                                        where: { id: req.body.transactionDetailId }
                                    })
                                        .then(num => {
                                            if (num < 1) {
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

                                    // Send Response
                                    res.send(data);
                                })
                                .catch(err => {
                                    res.status(500).send({
                                        message:
                                            err.message || "Some error occurred while creating the Return Item."
                                    });
                                });
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
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving return item."
            });
        });

};

// Retrieve all ReturnItem from the database.
exports.findAll = (req, res) => {
    var condition = req.query.transactionId ? { transactionId: { [Op.iLike]: `%${req.query.transactionId}%` } } : null;

    ReturnItem.findAll({
        where: condition,
        include: [{
            model: TransactionDetail,
            attributes: ['totalItem'],
            as: 'transactionDetail', // Specify the alias for the association
            include: [{
                model: ItemDetail,
                attributes: ['unit'],
                as: 'itemDetail', // Specify the alias for the association
                include: [{
                    model: Item,
                    attributes: ['name', 'merk'],
                    as: 'item', // Specify the alias for the association
                }]
            }]
        }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving return item."
            });
        });
};

// Find a single ReturnItem with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    ReturnItem.findOne({
        where: {
            id: id
        },
        include: [{
            model: Sale,
            attributes: ['customer'],
            as: 'sale', // Specify the alias for the association
        }]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find ReturnItem with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving ReturnItem with id=" + id
            });
        });
};

// Update a ReturnItem by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    ReturnItem.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ReturnItem was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update ReturnItem with id=${id}. Maybe Return Item was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating ReturnItem with id=" + id
            });
        });
};

// Delete a ReturnItem with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    ReturnItem.findOne({
        where: { id: id },
    })
        .then(dataReturnItem => {
            // Validation if return have same detail transaction
            if (dataReturnItem) {

                // Delete return item
                ReturnItem.destroy({
                    where: { id: id }
                })
                    .then(num => {
                        if (num == 1) {

                            TransactionDetail.update({ status: 'Ready to Check' }, {
                                where: { id: dataReturnItem.transactionDetailId }
                            })
                                .then(num => {
                                    if (num < 1) {
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

                            res.send({
                                message: "ReturnItem was deleted successfully!"
                            });
                        } else {
                            res.send({
                                message: `Cannot delete Return Item with id=${id}. Maybe ReturnItem was not found!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Could not delete ReturnItem with id=" + id
                        });
                    });
            } else {
                res.status(404).send({
                    msg: `Cannot find Return Item with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving return item."
            });
        });

};
