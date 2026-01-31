const express = require('express');
const { body } = require('express-validator');

const { createUser, login } = require('../controllers/authController');

route = express.Router(); // Sample authentication route

route.post(
  '/register',
  body('name').trim().notEmpty().isLength({ min: 3 }).escape().toLowerCase(),
  body('email').trim().notEmpty().isEmail().escape().toLowerCase(),
  body('password').trim().notEmpty().isStrongPassword().escape(),
  body('role')
    .trim()
    .default('customer')
    .escape()
    .toLowerCase()
    .isIn(['customer', 'admin']),
  createUser,
);

route.post(
  '/login',
  body('email').trim().notEmpty().isEmail().escape().toLowerCase(),
  body('password').trim().notEmpty().isStrongPassword().escape(),
  login,
);

module.exports = route;
