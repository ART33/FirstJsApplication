const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('//www.zjqpersonal.com');
});

module.exports = router;
