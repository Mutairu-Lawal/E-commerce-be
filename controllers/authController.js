const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/users');
const RESPONSE = require('../utils/serverResponse');

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw errors;
    }

    const { password, name, role, email } = req.body;

    // Find user data
    const user = await User.findOne({ email }).select('-hash_password');

    if (user) {
      throw new Error('User with the email exist');
    }

    // Hash the password
    const hash_password = await bcrypt.hash(password, 10);

    // Store data in the database
    await User.create({ name, email, role, hash_password });

    RESPONSE(res, 201, 'User created successfully');
  } catch (error) {
    if (error.message) {
      RESPONSE(res, 400, error.message);
    } else {
      RESPONSE(res, 422, error);
    }
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw errors;
    }

    const { password, email } = req.body;

    // Find user data
    const user = await User.findOne({ email });

    // If no user was found
    if (!user) {
      throw new Error();
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.hash_password);

    if (!isMatch) {
      throw new Error();
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    RESPONSE(res, 200, null, token);
  } catch (error) {
    RESPONSE(res, 400, 'Invalid Credentials');
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.user;

    const { name, email, role } =
      await User.findById(id).select('-hash_password');

    RESPONSE(res, 200, null, null, { name, email, role });
  } catch (error) {
    RESPONSE(res, 404, "User doesn't exist");
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

    RESPONSE(res, 200, 'User updated successfully');
  } catch (error) {
    RESPONSE(res, 400, error);
  }
};

module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
};
