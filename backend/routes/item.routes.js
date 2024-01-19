const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const item = require("../controllers/item.controller.js");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new Item
    router.post("/", item.create);
  
    // Retrieve all Item
    router.get("/", item.findAll);

    // Retrieve all Item without pagination
    router.get("/list", item.list);
  
    // Retrieve a single Item with id
    router.get("/:id", item.findOne);
  
    // Update a Item with id
    router.put("/:id", item.update);
  
    // Delete a Item with id
    router.delete("/:id", item.delete);
  
    app.use('/api/item', protect, router);
  };