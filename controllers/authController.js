const { validationResult } = require('express-validator');
const json = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/users');

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw errors;
    }

    const { password, name, role, email } = req.body;

    // find user data
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ Status: false, Message: 'User with the email exist' });
    }

    // hash the password
    const hash_password = await bcrypt.hash(password, 10);

    // Store data in the database
    await User.create({ name, email, role, hash_password });

    // Registration logic here
    res
      .status(201)
      .json({ Status: true, Message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ Status: false, Message: error });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw errors;
    }

    const { password, email } = req.body;

    // find user data
    const user = await User.findOne({ email });

    // if no user was found
    if (!user) {
      throw new Error();
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.hash_password);

    if (!isMatch) {
      throw new Error();
    }

    const token = json.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1m',
    });

    // Registration logic here
    res.status(200).json({ Status: true, token });
  } catch (error) {
    res.status(400).json({ Status: false, Message: 'Invalid Credentials' });
  }
};

module.exports = { createUser, login };
