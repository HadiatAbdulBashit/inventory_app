const { protect, onlyAdmin } = require('../middleware/auth.middleware');

module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    const router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", users.create);
  
    // Retrieve all Users
    router.get("/", users.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", users.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", onlyAdmin, users.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", users.delete);
  
    // Create a new Tutorial
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', protect, router);
  };