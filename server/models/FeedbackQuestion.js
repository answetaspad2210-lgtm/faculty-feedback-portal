// server/models/FeedbackQuestion.js
// Represents a single question that appears on the feedback form.
// Admin manages these; students answer them when submitting feedback.

const mongoose = require('mongoose');
const { QUESTION_TYPES } = require('../config/constants');

const feedbackQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      // e.g. "Course Content", "Faculty Teaching", "Interaction", "Assessment", "Overall"
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      enum: Object.values(QUESTION_TYPES),
      required: true,
    },
    // Used for multiple_choice questions. Ignored by other types.
    options: [{ type: String, trim: true }],
    // Used for star / numeric / slider questions to define valid bounds.
    minValue: { type: Number, default: 1 },
    maxValue: { type: Number, default: 5 },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      // Controls display order within a category.
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedbackQuestion', feedbackQuestionSchema);
