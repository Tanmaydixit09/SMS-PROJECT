const express = require('express');
const { register, login, forgotPassword, resetPassword, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.post('/google', googleLogin);

module.exports = router;
