const express = require('express');
const { is_Authorized, is_Authenticated } = require('../middlewares/auth');

const {
  getUsers,
  getUserByID,
  deleteUser,
} = require('../controllers/usersController');

const router = express.Router();

// only authenticated and authorized users can access these routes
// admins can access these routes
router.use(is_Authenticated, is_Authorized);

router.get('/', getUsers);

router.route('/:id').get(getUserByID).delete(deleteUser);

module.exports = router;
