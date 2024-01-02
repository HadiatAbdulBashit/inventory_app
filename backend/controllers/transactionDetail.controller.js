const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const TransactionDetail = db.transactionDetail
const ItemDetail = db.itemDetail;
const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Transaction Detail
exports.create = async(req, res) => {
    // Validate request
    if (!req.body.totalItem) {
        res.status(400).send({
            message: "Total item can not be empty!"
        });
        return;
    }

    // Save Transaction Detail in the database
    TransactionDetail.create(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Transaction Detail."
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
                attributes: ['name'],
                as: 'item', // Specify the alias for the association
            }]
        }]
     })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
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
                    message: `Cannot find Transaction Detail with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Transaction Detail with id=" + id
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
                    message: "Transaction Detail was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Transaction Detail with id=${id}. Maybe Transaction Detail was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Transaction Detail with id=" + id
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
                    message: "TransactionDetail was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Transaction Detail with id=${id}. Maybe Transaction Detail was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Transaction Detail with id=" + id
            });
        });
};