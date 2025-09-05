const express = require('express');
const router = express.Router();

// Example route: GET /api/destinations/test
router.get('/test', (req, res) => {
  res.json({ message: 'Destination route working!' });
});

module.exports = router;
