const express = require('express');
const { body } = require('express-validator');

const {
  createUser,
  login,
  getUser,
  updateUser,
} = require('../controllers/authController');
const checkAuth = require('../middlewares/auth');

router = express.Router(); // Sample authentication route

// protected route middleware
router.use('/me', checkAuth);

router.post(
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

router.post(
  '/login',
  body('email').trim().notEmpty().isEmail().escape().toLowerCase(),
  body('password').trim().notEmpty().isStrongPassword().escape(),
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
