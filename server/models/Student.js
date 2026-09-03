// server/models/Student.js
// Represents a student account. Students log in with this model
// and submit feedback for the courses assigned to them.

const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      // Always stored as a bcrypt hash - never plain text.
      // Hashing happens in a pre-save hook below.
      type: String,
      required: true,
      select: false, // excluded from query results by default
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
    assignedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    role: {
      type: String,
      enum: [ROLES.STUDENT],
      default: ROLES.STUDENT,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

const bcrypt = require('bcryptjs');

// Hash the password before saving, but only if it was modified.
studentSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Instance method to compare a plain-text password against the stored hash.
studentSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
