const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Tạm thời để routes trống vì chúng ta chỉ cần file này tồn tại
router.get('/', protect, (req, res) => {
  res.json({ message: 'User routes working' });
});

module.exports = router; 