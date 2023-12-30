const { Sequelize } = require('sequelize');
const path = require("path");
const fs = require("fs");
const { v4 } = require('uuid');

const db = require("../models");

const Item = db.item;
const Op = Sequelize.Op;

// Create and Save a new Item
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            msg: "Name can not be empty!"
        });
    }
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + v4() + ext;
    const url = `${req.protocol}://${req.get("host")}/images/items/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid format Images" });
    if (fileSize > 2000000) return res.status(422).json({ msg: "Image must be less than 2 MB" });

    file.mv(`./backend/public/images/items/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            // Save Item in the database
            await Item.create({ ...req.body, imageUrl: url });
            res.status(201).json({ msg: "Item saved" });
        } catch (error) {
            res.status(500).send({
                msg:
                    error.message || "Some error occurred while creating the Item."
            });
        }
    })
};

// Retrieve all Item from the database.
exports.findAll = (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 3;
    let sort = req.query.sort || "name";
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

    var condition = req.query.name ? { name: { [Op.iLike]: `%${req.query.name}%` } } : null;

    condition = req.query.category && condition ? { ...condition, category: { [Op.or]: filterCategory } } : condition ? condition : req.query.category ? { category: { [Op.or]: filterCategory } } : null;

    Item.count({
        where: condition
    })
        .then(totalData => total = totalData)
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving item."
            });
        });

    Item.findAll({
        where: condition,
        offset: page * limit,
        limit: limit,
        order: [sort]
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
                msg:
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
                    msg: `Cannot find Item with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                msg: "Error retrieving Item with id=" + id
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
        fileName = file.md5 + v4() + ext;
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
        await Item.update({ ...req.body, imageUrl: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({ msg: "Item Updated" });
    } catch (error) {
        res.status(500).send({
            msg:
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
            msg: "Could not delete Item with id = " + req.params.id + ", maybe image has deleted"
        });
    }
};
