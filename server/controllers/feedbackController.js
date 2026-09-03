// server/controllers/feedbackController.js
const asyncHandler = require('../utils/asyncHandler');
const feedbackService = require('../services/feedbackService');

// POST /api/feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbackService.submitFeedback(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback });
});

module.exports = { submitFeedback };
