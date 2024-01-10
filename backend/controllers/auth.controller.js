const { generateToken } = require('../utils/generate.token')
const db = require("../models");
const User = db.user;
const argon2 = require("argon2");
const asyncHandler = require('express-async-handler');

// @desc    Auth user & get token
// @route   POST /api/auth
// @access  Public
exports.authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        where: {
            username: username
        }
    });

    if (user && (await argon2.verify(user.password, password))) {
        generateToken(res, user.id);

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    get user from token
// @route   get /api/auth/me
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};