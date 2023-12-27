const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const ItemDetail = db.itemDetail
const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Item Detail
exports.create = async(req, res) => {
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

// Retrieve all Item Detail from the database.
exports.findAll = (req, res) => {
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
};