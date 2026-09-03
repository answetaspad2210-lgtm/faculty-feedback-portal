// server/routes/courseRoutes.js
const express = require('express');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.post('/', protect, authorize(ROLES.ADMIN), createCourse);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateCourse);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCourse);

module.exports = router;
