const express = require('express');
const {register,login, logout, updateProfile, checkAuth} = require('../controllers/user.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.put('/update-profile', isAuthenticated, updateProfile);
router.get("/check", isAuthenticated, checkAuth);

module.exports = router;

