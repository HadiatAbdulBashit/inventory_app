const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const itemDetail = require("../controllers/itemDetail.controller");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new Item
    router.post("/", itemDetail.create);
  
    // Retrieve all Item
    router.get("/", itemDetail.findAll);
  
    // Retrieve a single Item with id
    router.get("/:id", itemDetail.findOne);
    
    // Update a Item with id
    router.put("/:id", itemDetail.update);
  
    // Delete a Item with id
    router.delete("/:id", itemDetail.delete);
  
    app.use('/api/item-detail', protect, router);
  };