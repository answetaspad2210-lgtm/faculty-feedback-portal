// server/middleware/errorHandler.js
// Centralized error handler - the LAST middleware registered in server.js.
// Every controller can simply `throw new ApiError(...)` or pass an error
// to next(err), and it always ends up here with a consistent JSON shape.

function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  // Mongoose duplicate key error (e.g. duplicate feedback submission,
  // duplicate email) -> map to a friendly 409 Conflict.
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry - this record already exists.',
    });
  }

  // Mongoose validation error -> 400 Bad Request with field details.
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  const statusCode = err.statusCode || 500;

  // Never leak internal error details (stack traces, DB info) to the client.
  const message =
    err.isOperational || statusCode < 500
      ? err.message
      : 'Something went wrong on the server. Please try again later.';

  if (statusCode >= 500) {
    // Still log the real error server-side for debugging.
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
