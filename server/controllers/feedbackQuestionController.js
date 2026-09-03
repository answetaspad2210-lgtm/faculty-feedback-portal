// server/controllers/feedbackQuestionController.js
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const FeedbackQuestion = require('../models/FeedbackQuestion');

// GET /api/feedback/questions - active questions, grouped for the form
const getActiveQuestions = asyncHandler(async (req, res) => {
  const questions = await FeedbackQuestion.find({ isActive: true }).sort({ category: 1, order: 1 });
  res.status(200).json({ success: true, data: questions });
});

// GET /api/admin/questions - all questions (including inactive) for management
const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await FeedbackQuestion.find().sort({ category: 1, order: 1 });
  res.status(200).json({ success: true, data: questions });
});

const createQuestion = asyncHandler(async (req, res) => {
  const { question, category, questionType } = req.body;
  if (!question || !category || !questionType) {
    throw new ApiError(400, 'question, category, and questionType are required');
  }
  const newQuestion = await FeedbackQuestion.create(req.body);
  res.status(201).json({ success: true, data: newQuestion });
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await FeedbackQuestion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!question) throw new ApiError(404, 'Question not found');
  res.status(200).json({ success: true, data: question });
});

// DELETE - soft delete (deactivate) so past feedback answers keep their reference
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await FeedbackQuestion.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!question) throw new ApiError(404, 'Question not found');
  res.status(200).json({ success: true, message: 'Question deactivated' });
});

module.exports = { getActiveQuestions, getAllQuestions, createQuestion, updateQuestion, deleteQuestion };
