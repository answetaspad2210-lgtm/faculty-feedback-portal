// server/utils/generateToken.js
// Small helper to create a signed JWT for a logged-in user.
// Keeping this in one place means the token "shape" (payload fields,
// expiry) is defined once and reused by every login/register endpoint.

const jwt = require('jsonwebtoken');

function generateToken({ id, role }) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = generateToken;
