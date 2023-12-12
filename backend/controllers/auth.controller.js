const asyncHandler = require('express-async-handler');
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Only Super Admin
exports.authUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Success' });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
exports.logoutUser = (req, res) => {
    res.json({ message: 'logout user' });
};