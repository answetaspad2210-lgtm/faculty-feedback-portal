// server/models/Course.js
// Represents a course offering for a specific semester/academic year,
// taught by one faculty member.

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    academicYear: {
      // e.g. "2025-2026"
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// A course is uniquely identified by its code + semester + academic year,
// so the same code can be reused across different terms without clashing.
courseSchema.index(
  { courseCode: 1, semester: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model('Course', courseSchema);
