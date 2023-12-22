const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const purchase = require("../controllers/purchase.controller.js");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new purchase
    router.post("/", purchase.create);
  
    // Retrieve all purchase
    router.get("/", purchase.findAll);
  
    // Retrieve a single purchase with id
    router.get("/:id", purchase.findOne);
  
    // Update a purchase with id
    router.put("/:id", purchase.update);
  
    // Delete a purchase with id
    router.delete("/:id", purchase.delete);
  
    app.use('/api/purchase', protect, router);
  };