// server/middleware/authMiddleware.js
// Two pieces:
//  1. `protect`  - verifies the JWT sent in the Authorization header and
//                  attaches the decoded { id, role } to req.user.
//  2. `authorize(...roles)` - restricts a route to specific roles
//                  (use AFTER `protect`).

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { ROLES } = require('../config/constants');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized - no token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Not authorized - invalid or expired token');
  }

  // Confirm the user still exists (in case the account was deleted after
  // the token was issued) and attach a lightweight user object to req.
  let account;
  if (decoded.role === ROLES.ADMIN) {
    account = await Admin.findById(decoded.id);
  } else {
    account = await Student.findById(decoded.id);
  }

  if (!account) {
    throw new ApiError(401, 'Not authorized - account no longer exists');
  }

  req.user = { id: decoded.id, role: decoded.role };
  next();
});

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, 'Forbidden - you do not have access to this resource');
  }
  next();
};

module.exports = { protect, authorize };
