const dotenv = require('dotenv');
dotenv.config()

exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

exports.errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    res.status(statusCode).json({
        message: message,
        stack: dotenv.NODE_ENV === 'production' ? null : err.stack,
    });
};