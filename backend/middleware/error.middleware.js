const dotenv = require('dotenv');
const db = require("../models");
const AppLog = db.appLog;
dotenv.config()

exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

exports.appLog = (err, req, res, next) => {
    const { message, stack } = err;

    AppLog.create({ ipAddress: req.ip, message, stack, method: req.method, url: req.originalUrl, })
        .then(data => {
            console.log('============= New Error saved ================');
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while app log."
            });
        });

    next(err);
}

exports.errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    res.status(statusCode).json({
        message: message,
        stack: dotenv.NODE_ENV === 'production' ? null : err.stack,
    });
};