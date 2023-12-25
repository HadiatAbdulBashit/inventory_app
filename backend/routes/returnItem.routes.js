const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const returnItem = require("../controllers/returnItem.controller");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new Return Item
    router.post("/", returnItem.create);
  
    // Retrieve all Return Item
    router.get("/", returnItem.findAll);
  
    // Retrieve a single Return Item with id 
    router.get("/:id", returnItem.findOne);
  
    // Update a Return Item with id
    router.put("/:id", returnItem.update);
  
    // Delete a Return Item with id
    router.delete("/:id", returnItem.delete);
  
    app.use('/api/return', protect, router);
  };