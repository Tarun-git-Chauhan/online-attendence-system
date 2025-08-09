const express = require('express');
const router = express.Router();

//  Add loginUser to the import
const { registerUser, forgotPassword, loginUser } = require('../controllers/authController');

// Registration Route
router.post('/register', registerUser);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

//  Login Route
router.post('/login', loginUser);

module.exports = router;
