const { protect, onlyAdmin } = require('../middleware/auth.middleware');

module.exports = app => {
    const goods = require("../controllers/goods.controller.js");
  
    const router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", goods.create);
  
    // Retrieve all Users
    router.get("/", goods.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", goods.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", goods.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", goods.delete);
  
    // Create a new Tutorial
    router.delete("/", goods.deleteAll);
  
    app.use('/api/goods', protect, router);
  };