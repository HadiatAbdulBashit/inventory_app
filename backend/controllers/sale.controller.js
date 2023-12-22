const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const Sale = db.sale;
const User = db.user;
const Op = Sequelize.Op;

// Create and Save a new Sale
exports.create = async(req, res) => {
    // Validate request
    if (!req.body.customer) {
        res.status(400).send({
            message: "Customer can not be empty!"
        });
        return;
    }

    // Save Sale in the database
    Sale.create({...req.body, userId: req.user.id})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Sale."
            });
        });
};

// Retrieve all Sale from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Sale.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving sale."
            });
        });
};

// Find a single Sale with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Sale.findOne({
        where: {
            id: id
        },
        include: [{
            model: User,
            attributes: ['name', 'role'],
            as: 'user', // Specify the alias for the association
        }]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Sale with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Sale with id=" + id
            });
        });
};

// Update a Sale by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Sale.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Sale was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Sale with id=${id}. Maybe Sale was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Sale with id=" + id
            });
        });
};

// Delete a Sale with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Sale.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Sale was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Sale with id=${id}. Maybe Sale was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Sale with id=" + id
            });
        });
};
