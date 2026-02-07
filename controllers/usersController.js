const User = require('../models/users');
const { sendResponse } = require('../utils/serverResponse');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hash_password').limit(100);
    sendResponse({ res, statusCode: 200, data: users });
  } catch (error) {
    console.error(error);
    sendResponse({ res, statusCode: 400 });
  }
};

const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-hash_password');

    if (!user) {
      throw new Error();
    }

    sendResponse({ res, statusCode: 200, data: user });
  } catch (error) {
    console.error(error);
    sendResponse({ res, statusCode: 404 });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);

    sendResponse({ res, statusCode: 204 });
  } catch (error) {
    sendResponse({ res, statusCode: 404, message: error.message || error });
  }
};

module.exports = { getUsers, getUserByID, deleteUser };
