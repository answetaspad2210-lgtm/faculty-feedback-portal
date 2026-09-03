// server/models/Feedback.js
// Represents one student's submitted feedback for one course/faculty
// pairing in a given semester + academic year.

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeedbackQuestion',
      required: true,
    },
    // Flexible value field: holds a number (star/numeric/slider),
    // a string (text/multiple_choice), or a boolean (yes/no).
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    answers: [answerSchema],
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// CRITICAL: prevents the same student from submitting feedback more than
// once for the same course + faculty + academic period. MongoDB enforces
// this at the database level, so even a race condition or a bug in the
// controller logic cannot create a duplicate.
feedbackSchema.index(
  { student: 1, course: 1, faculty: 1, academicYear: 1, semester: 1 },
  { unique: true }
);

// Note on anonymity: we still store the `student` reference so the
// database-level duplicate check keeps working. "Anonymous" instead means
// the API layer strips/hides the student's identity whenever feedback is
// returned to admins in reports (see feedbackController + reportService).
// True anonymity (no student reference at all) would make duplicate
// prevention impossible, so this is the standard trade-off for this kind
// of system.

module.exports = mongoose.model('Feedback', feedbackSchema);
