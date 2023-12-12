const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require("../models");
const User = db.users;

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ljk&*(GHT^E^%@');

      req.user = await User.findOne({
        attributes: ['uuid','name','username'],
        where: {
          uuid: decoded.userId
        }
      });

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});