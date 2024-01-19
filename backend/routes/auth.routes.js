const router = require("express").Router();

const auth = require("../controllers/auth.controller.js");
const { protect, onlyAdmin } = require('../middleware/auth.middleware');

module.exports = app => {

    // Auth User / Login
    router.post('/', auth.authUser);

    // Get User
    router.get('/me', protect, auth.getUser);
    
    // Auth User / Logout
    router.post('/logout', auth.logoutUser);

    app.use('/api/auth', router);
};