const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Registration logic here
    res.status(200).json({ Status: true, token });
  } catch (error) {
    res.status(400).json({ Status: false, Message: 'Invalid Credentials' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, role } = await User.findById(id);

    res.status(200).json({ name, email, role });
  } catch (error) {
    res.status(404).json({ Status: false, Message: `User doesn't exist` });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw errors;
    }

    const { id } = req.user;
    const { name } = req.body;

    await User.findByIdAndUpdate(id, { name });

    res
      .status(200)
      .json({ Status: true, Message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ Status: false, Message: error });
  }
};

module.exports = { createUser, login, getUser, updateUser };
