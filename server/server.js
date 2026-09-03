// server/server.js
// Entry point - wires together middleware, routes, and the DB connection.
// Kept intentionally thin: all real logic lives in routes/controllers/services.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require('./routes/courseRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const feedbackQuestionRoutes = require('./routes/feedbackQuestionRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();

// ---- Global middleware ----
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev')); // request logging, helpful for a beginner to see what's happening

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// ---- Feature routes ----
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackQuestionRoutes); // adds /api/feedback/questions*
app.use('/api/admin', adminRoutes);

// ---- 404 + centralized error handler (must be registered last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
