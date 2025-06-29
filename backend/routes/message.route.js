const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { getUsers, getmessages, sendmessage } = require('../controllers/message.controller');

const router = express.Router();

router.get('/users', isAuthenticated, getUsers);
router.get('/:id', isAuthenticated, getmessages);
router.post("/send/:id", isAuthenticated, sendmessage);

module.exports = router;
