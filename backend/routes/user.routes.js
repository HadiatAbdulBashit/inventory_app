const { protect, onlyAdmin } = require('../middleware/auth.middleware');

module.exports = app => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Update a User with id
  router.put("/:id/reset", users.resetPassword);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Create all User
  router.delete("/", users.deleteAll);

  app.use('/api/users', protect, onlyAdmin, router);
};