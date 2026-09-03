// server/controllers/authController.js
// Handles incoming HTTP requests for authentication and delegates the
// actual work to authService. A single `role` field in the request body
// tells us whether to authenticate against the Student or Admin collection.

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const authService = require('../services/authService');
const { ROLES } = require('../config/constants');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, 'Email, password, and role are required');
  }

  let result;
  if (role === ROLES.STUDENT) {
    result = await authService.loginStudent(email, password);
  } else if (role === ROLES.ADMIN) {
    result = await authService.loginAdmin(email, password);
  } else {
    throw new ApiError(400, 'Invalid role - must be "student" or "admin"');
  }

  res.status(200).json({ success: true, data: result });
});

// GET /api/auth/me - returns the currently logged-in user's basic info.
// Relies on `protect` middleware having set req.user already.
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

module.exports = { login, getMe };
