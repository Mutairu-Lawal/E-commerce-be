const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

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
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw errors;
      }

      const { password, name, role, email } = req.body;

      // hash the password
      const hash_password = await bcrypt.hash(password, 10);

      // Store data in the database
      const user = User.create({ name, email, role, hash_password });

      // Registration logic here
      res
        .status(201)
        .json({ Status: true, Message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ Status: false, Message: error });
    }
  },
);

module.exports = route;
