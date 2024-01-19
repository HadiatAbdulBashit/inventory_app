const { protect, onlyAdmin } = require('../middleware/auth.middleware');

module.exports = app => {
    const apps = require("../controllers/app.controller.js");
  
    const router = require("express").Router();
  
    // Retrieve data for dashboard
    router.get("/dashboard", apps.dashboard);
  
    // Retrieve data app log
    router.get("/app-log", apps.appLog);
  
    app.use('/api', protect, router);
  };