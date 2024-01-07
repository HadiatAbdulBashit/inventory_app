const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const itemDetail = require("../controllers/itemDetail.controller");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new Item detail
    router.post("/", itemDetail.create);
  
    // Retrieve all Item detail
    router.get("/", itemDetail.findAll);
    
    // Retrieve all Item detail without pagination
    router.get("/list", itemDetail.list);
  
    // Retrieve a single Item detail with id
    router.get("/:id", itemDetail.findOne);
    
    // Update a Item detail with id
    router.put("/:id", itemDetail.update);
  
    // Delete a Item detail with id
    router.delete("/:id", itemDetail.delete);
  
    app.use('/api/item-detail', protect, router);
  };