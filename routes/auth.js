const express = require('express');
const { body } = require('express-validator');

const {
  createUser,
  login,
  getUser,
  updateUser,
} = require('../controllers/authController');
const { is_Authenticated } = require('../middlewares/auth');

router = express.Router(); // Sample authentication route

router.use('/me', is_Authenticated);

router.post(
  '/register',
  body('name').trim().notEmpty().isLength({ min: 3 }).escape().toLowerCase(),
  body('email').trim().notEmpty().isEmail().escape().toLowerCase(),
  body('password').trim().notEmpty().isStrongPassword(),
  body('role')
    .trim()
    .default('customer')
    .escape()
    .toLowerCase()
    .isIn(['customer', 'admin']),
  createUser,
);

router.post(
  '/login',
  body('email').trim().notEmpty().isEmail().escape().toLowerCase(),
  body('password').trim().notEmpty().isStrongPassword(),
  login,
);

// protected route
router
  .route('/me')
  .get(getUser)
  .put(
    body('name').trim().notEmpty().isLength({ min: 3 }).escape().toLowerCase(),
    updateUser,
  );

module.exports = router;
