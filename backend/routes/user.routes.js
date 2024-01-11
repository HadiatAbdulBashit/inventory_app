const { protect, onlyAdmin } = require('../middleware/auth.middleware');

module.exports = app => {
  const users = require("../controllers/user.controller.js");

  const router = require("express").Router();

  // Create a new User
  router.post("/", onlyAdmin, users.create);

  // Retrieve all Users
  router.get("/", onlyAdmin, users.findAll);

  // Retrieve a single User with id
  router.get("/:id", onlyAdmin, users.findOne);

  // Update a User with id
  router.put("/:id", onlyAdmin, users.update);

  // Update a User with id
  router.put("/:id/reset", users.resetPassword);

  // Delete a User with id
  router.delete("/:id", onlyAdmin, users.delete);

  // Create all User
  router.delete("/", onlyAdmin, users.deleteAll);

  app.use('/api/users', protect, router);
};