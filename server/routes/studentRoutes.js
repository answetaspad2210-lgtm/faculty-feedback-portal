// server/routes/studentRoutes.js
const express = require('express');
const { getDashboard } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/dashboard', protect, authorize(ROLES.STUDENT), getDashboard);

module.exports = router;
