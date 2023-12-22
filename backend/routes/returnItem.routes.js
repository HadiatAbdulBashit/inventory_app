const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const returnItem = require("../controllers/returnItem.controller");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new returnItem
    router.post("/", returnItem.create);
  
    // Retrieve all returnItem
    router.get("/", returnItem.findAll);
  
    // Retrieve a single returnItem with id 
    router.get("/:id", returnItem.findOne);
  
    // Update a returnItem with id
    router.put("/:id", returnItem.update);
  
    // Delete a returnItem with id
    router.delete("/:id", returnItem.delete);
  
    app.use('/api/return', protect, router);
  };