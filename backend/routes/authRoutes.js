const express = require('express');
const router = express.Router();

// Example route: GET /api/auth/test
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

module.exports = router;
