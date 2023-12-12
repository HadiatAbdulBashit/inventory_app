module.exports = app => {
    const auth = require("../controllers/auth.controller.js");

    const router = require("express").Router();

    // Auth User / Login
    router.post('/', auth.authUser);
    
    // Auth User / Logout
    router.post('/logout', auth.logoutUser);

    app.use('/api/auth', router);
};