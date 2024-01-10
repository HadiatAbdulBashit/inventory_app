const { protect, onlyOffice } = require('../middleware/auth.middleware');
const transactionDetail = require("../controllers/transactionDetail.controller");
const router = require("express").Router();

module.exports = app => {
  // Create a new Transaction
  router.post("/", transactionDetail.create);

  // Retrieve all Transaction
  router.get("/", transactionDetail.findAll);

  // Retrieve a single Transaction with id
  router.get("/:id", transactionDetail.findOne);

  // Update a Transaction with id
  router.put("/:id", transactionDetail.update);

  // Delete a Transaction with id
  router.delete("/:id", transactionDetail.delete);

  app.use('/api/transaction-detail', protect, router);
};