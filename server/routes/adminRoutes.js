// server/routes/adminRoutes.js
// Every route here is admin-only, enforced at the router level so
// individual controllers don't need to repeat the check.
const express = require('express');
const { getDashboard, getReports } = require('../controllers/adminController');
const { getAllStudents, createStudent, updateStudent, deleteStudent } = require('../controllers/adminStudentController');
const {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/feedbackQuestionController');
const { getFacultyById, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', getDashboard);
router.get('/reports', getReports);

router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/faculty/:id', getFacultyById);
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
