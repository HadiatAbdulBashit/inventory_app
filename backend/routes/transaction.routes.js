const { protect, onlyAdmin } = require('../middleware/auth.middleware');
const transaction = require("../controllers/transaction.controller.js");
const router = require("express").Router();

module.exports = app => {
  
    // Create a new transaction
    router.post("/", transaction.create);
  
    // Retrieve all transaction
    router.get("/", transaction.findAll);
  
    // Retrieve a single transaction with id
    router.get("/:id", transaction.findOne);
  
    // Update a transaction with id
    router.put("/:id", transaction.update);
  
    // Delete a transaction with id
    router.delete("/:id", transaction.delete);
  
    app.use('/api/transaction', protect, router);
  };