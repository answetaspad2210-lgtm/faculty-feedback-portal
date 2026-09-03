// server/routes/facultyRoutes.js
const express = require('express');
const { getAllFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Any logged-in user can view the faculty list (students need it for the feedback form).
router.get('/', protect, getAllFaculty);

// Admin-only management routes.
router.get('/:id', protect, authorize(ROLES.ADMIN), getFacultyById);
router.post('/', protect, authorize(ROLES.ADMIN), createFaculty);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateFaculty);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteFaculty);

module.exports = router;
