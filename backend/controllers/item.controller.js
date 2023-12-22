const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Item
exports.create = async(req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Save Item in the database
    Item.create(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Item."
            });
        });
};

// Retrieve all Item from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Item.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single Item with an id
exports.findOne = (req, res) => {
    const uuid = req.params.id;

    Item.findOne({
        where: {
            uuid: uuid
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Item with id=${uuid}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Item with id=" + id
            });
        });
};

// Update a Item by the id in the request
exports.update = (req, res) => {
    const uuid = req.params.id;

    Item.update(req.body, {
        where: { uuid: uuid }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Item was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Item with id=${uuid}. Maybe Item was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Item with id=" + uuid
            });
        });
};

// Delete a Item with the specified id in the request
exports.delete = (req, res) => {
    const uuid = req.params.id;

    Item.destroy({
        where: { uuid: uuid }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Item was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Item with id=${uuid}. Maybe Item was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Item with id=" + uuid
            });
        });
};
