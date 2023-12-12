const asyncHandler = require('express-async-handler');
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Only Super Admin
exports.authUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Success' });
});