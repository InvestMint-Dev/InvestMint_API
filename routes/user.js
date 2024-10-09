// routes/user.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.send('This is a protected profile page.');
});

module.exports = router;
