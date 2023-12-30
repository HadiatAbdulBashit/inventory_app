const argon2 = require("argon2");
const { Sequelize } = require('sequelize');

const db = require("../models");

const User = db.user;
const Op = Sequelize.Op;

// Create and Save a new User
exports.create = async(req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const hashPassword = await argon2.hash(req.body.password);

    // Create a User
    const user = {
        username: req.body.username,
        name: req.body.name,
        password: hashPassword,
        role: req.body.role,
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 3;
    let sort = req.query.sort || "name";
    let total = null
    let filterCategory = req.query.category || "All";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    
    const categoryOption = [
        "super",
        "admin",
        "staff",
    ];

    filterCategory === "All" ? filterCategory = [...categoryOption] : filterCategory = req.query.category.split(",");

    var condition = req.query.title ? { title: { [Op.iLike]: `%${req.query.title}%` } } : null;

    condition = req.query.category && condition ? { ...condition, category: { [Op.or]: filterCategory } } : condition ? condition : req.query.category ? { category: { [Op.or]: filterCategory } } : null;

    User.count({
        where: condition
    })
        .then(totalData => total = totalData)
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user."
            });
        });

    User.findAll({ 
        where: condition,
        offset: page * limit,
        limit: limit,
        order: [sort]
    })
        .then(user => {
            res.send({
                page,
                limit,
                user,
                total,
                category: categoryOption
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findOne({
        where: {
            id: id
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Delete all User from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} User were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};
