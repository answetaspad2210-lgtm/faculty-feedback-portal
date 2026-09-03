// server/routes/feedbackQuestionRoutes.js
const express = require('express');
const {
  getActiveQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/feedbackQuestionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Students fetch the active question set to render the feedback form.
router.get('/questions', protect, getActiveQuestions);

// Admin management endpoints.
router.get('/questions/all', protect, authorize(ROLES.ADMIN), getAllQuestions);
router.post('/questions', protect, authorize(ROLES.ADMIN), createQuestion);
router.put('/questions/:id', protect, authorize(ROLES.ADMIN), updateQuestion);
router.delete('/questions/:id', protect, authorize(ROLES.ADMIN), deleteQuestion);

module.exports = router;
