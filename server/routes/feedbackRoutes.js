// server/routes/feedbackRoutes.js
// Note: the "/questions" endpoints live in feedbackQuestionRoutes.js and are
// mounted separately in server.js under the same /api/feedback prefix -
// this file only handles feedback SUBMISSION.
const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.post('/', protect, authorize(ROLES.STUDENT), submitFeedback);

module.exports = router;
