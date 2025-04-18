
const express = require('express');
const router = express.Router();
const { submitRequest, handleApproval } = require('../controllers/requestController');

router.post('/request', submitRequest);
router.get('/approve', handleApproval);

module.exports = router;
