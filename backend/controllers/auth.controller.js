const { generateToken } = require('../utils/generate.token')
const db = require("../models");
const User = db.users;
const argon2 = require("argon2");
const asyncHandler = require('express-async-handler');

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Only Super Admin
exports.authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        where: {
            username: username
        }
    });

    if (user && (await argon2.verify(user.password, password))) {
        generateToken(res, user.uuid);

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
exports.logoutUser = (req, res) => {
    res.json({ message: 'logout user' });
};