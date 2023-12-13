const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require("../models");
const User = db.users;
const dotenv = require('dotenv');
dotenv.config()

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, dotenv.JWT_SECRET || 'ljk&*(GHT^E^%@');

      req.user = await User.findOne({
        attributes: ['uuid', 'name', 'username'],
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

exports.onlyAdmin = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, dotenv.JWT_SECRET || 'ljk&*(GHT^E^%@');

      req.user = await User.findOne({
        attributes: ['uuid', 'name', 'username', 'role'],
        where: {
          uuid: decoded.userId
        }
      });

      if (req.user.role !== 'a') {
        res.status(403)
        throw new Error('Forbiden Access');
      }

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