// server/services/authService.js
// Business logic for authentication, kept separate from the controller
// so the controller only deals with request/response concerns.

const Student = require('../models/Student');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const { ROLES } = require('../config/constants');

async function loginStudent(email, password) {
  // .select('+password') is needed because the schema hides password by default.
  const student = await Student.findOne({ email }).select('+password');

  if (!student || !student.isActive) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await student.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: student._id, role: ROLES.STUDENT });

  return {
    token,
    user: {
      id: student._id,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      department: student.department,
      semester: student.semester,
      role: ROLES.STUDENT,
    },
  };
}

async function loginAdmin(email, password) {
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: admin._id, role: ROLES.ADMIN });

  return {
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: ROLES.ADMIN,
    },
  };
}

module.exports = { loginStudent, loginAdmin };
