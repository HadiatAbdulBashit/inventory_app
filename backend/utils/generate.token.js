const dotenv = require('dotenv');
dotenv.config()
const jwt = require('jsonwebtoken');

exports.generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, dotenv.JWT_SECRET || 'ljk&*(GHT^E^%@', {
        expiresIn: '10d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: dotenv.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 1 * 10 * 60 * 60 * 1000, // 10 hours
    });
};