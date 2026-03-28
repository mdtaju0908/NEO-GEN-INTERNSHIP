const express = require('express');
const { loginAdmin } = require('../controllers/authController');

const router = express.Router();

// Admin authentication (intentionally open as per controller logic)
router.post('/login', loginAdmin);

module.exports = router;
