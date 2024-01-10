const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require("../models");
const User = db.user;
const dotenv = require('dotenv');
dotenv.config()

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, dotenv.JWT_SECRET || 'ljk&*(GHT^E^%@');

      req.user = await User.findOne({
        attributes: ['id', 'name', 'username', 'role'],
        where: {
          id: decoded.userId
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
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, dotenv.JWT_SECRET || 'ljk&*(GHT^E^%@');

      req.user = await User.findOne({
        attributes: ['id', 'name', 'username', 'role'],
        where: {
          id: decoded.userId
        }
      });

      if (req.user.role !== 'Super Admin' || req.user.role !== 'Admin') {
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

exports.onlyOffice = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, dotenv.JWT_SECRET || 'ljk&*(GHT^E^%@');

      req.user = await User.findOne({
        attributes: ['id', 'name', 'username', 'role'],
        where: {
          id: decoded.userId
        }
      });

      if (req.user.role !== 'Office' || req.user.role !== 'Admin') {
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