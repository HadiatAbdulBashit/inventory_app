const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const item = require("../controllers/item.controller.js");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new Tutorial
    router.post("/", item.create);
  
    // Retrieve all Users
    router.get("/", item.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", item.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", item.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", item.delete);
  
    app.use('/api/item', protect, router);
  };