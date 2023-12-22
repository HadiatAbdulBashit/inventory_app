const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const sale = require("../controllers/sale.controller.js");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new sale
    router.post("/", sale.create);
  
    // Retrieve all sale
    router.get("/", sale.findAll);
  
    // Retrieve a single sale with id
    router.get("/:id", sale.findOne);
  
    // Update a sale with id
    router.put("/:id", sale.update);
  
    // Delete a sale with id
    router.delete("/:id", sale.delete);
  
    app.use('/api/sale', protect, router);
  };