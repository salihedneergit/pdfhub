const express = require('express');
const { googleAuth, getAllUsers, toggleUserStatus,logout,sessionCheck  } = require('../controllers/User');


const router = express.Router();

router.post('/google', googleAuth);
router.post('/logout',logout);
router.post('/session-check', sessionCheck);

module.exports = router;