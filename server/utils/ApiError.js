// server/utils/ApiError.js
// A small custom Error class that carries an HTTP status code.
// Controllers throw/pass this to next(), and the central error handler
// (middleware/errorHandler.js) turns it into a consistent JSON response.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from bugs
  }
}

module.exports = ApiError;
