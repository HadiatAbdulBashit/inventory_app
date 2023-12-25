const { Sequelize } = require('sequelize');
const path = require("path");
const fs = require("fs");

const db = require("../models");

const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Item
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Name can not be empty!"
        });
    }
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/items/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid format Images" });
    if (fileSize > 2000000) return res.status(422).json({ msg: "Image must be less than 2 MB" });

    file.mv(`./backend/public/images/items/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            // Save Item in the database
            await Item.create({ name: req.body.name, unit: req.body.unit, imageUrl: url });
            res.status(201).json({ msg: "Item saved" });
        } catch (error) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Item."
            });
        }
    })
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
    const id = req.params.id;

    Item.findOne({
        where: {
            id: id
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Item with id=${id}.`
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
exports.update = async (req, res) => {
    const item = await Item.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!item) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        const splitUrl = item.imageUrl.split('/');
        fileName = splitUrl[splitUrl.length - 1];
    } else {
        const file = req.files.image;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid format Images" });
        if (fileSize > 2000000) return res.status(422).json({ msg: "Image must be less than 2 MB" });

        // Delete Image
        const splitUrl = item.imageUrl.split('/');
        const imageName = splitUrl[splitUrl.length - 1];
        const filePath = `./backend/public/images/items/${imageName}`;
        fs.unlinkSync(filePath);

        // Save image
        file.mv(`./backend/public/images/items/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        })
    }
    const url = `${req.protocol}://${req.get("host")}/images/items/${fileName}`;

    try {
        // Update Item to the database
        await Item.update({ name: req.body.name, unit: req.body.unit, imageUrl: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({ msg: "Item Updated" });
    } catch (error) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Item."
        });
    }
};

// Delete a Item with the specified id in the request
exports.delete = async (req, res) => {
    const item = await Item.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!item) return res.status(404).json({ msg: "No Data Found" });

    try {
        const splitUrl = item.imageUrl.split('/');
        const imageName = splitUrl[splitUrl.length - 1];
        const filePath = `./backend/public/images/items/${imageName}`;
        fs.unlinkSync(filePath);
        await Item.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Item Deleted Successfuly" });
    } catch (error) {
        res.status(500).send({
            message: "Could not delete Item with id=" + req.params.id
        });
    }
};
