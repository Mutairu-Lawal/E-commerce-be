const User = require('../models/users');
const RESPONSE = require('../utils/serverResponse');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hash_password').limit(100);
    RESPONSE(res, 200, users);
  } catch (error) {
    console.error(error);
    RESPONSE(res, 400);
  }
};

const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-hash_password');

    if (!user) {
      throw new Error();
    }

    RESPONSE(res, 200, user);
  } catch (error) {
    console.error(error);
    RESPONSE(res, 404);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);

    RESPONSE(res, 204);
  } catch (error) {
    RESPONSE(res, 404, error);
  }
};

module.exports = { getUsers, getUserByID, deleteUser };
