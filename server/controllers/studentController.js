// server/controllers/studentController.js
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Student = require('../models/Student');
const feedbackService = require('../services/feedbackService');

// GET /api/students/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id);
  if (!student) throw new ApiError(404, 'Student not found');

  const overview = await feedbackService.getStudentFeedbackOverview(req.user.id);
  const pending = overview.filter((c) => c.status === 'pending').length;
  const completed = overview.filter((c) => c.status === 'completed').length;

  res.status(200).json({
    success: true,
    data: {
      student: {
        name: student.name,
        department: student.department,
        semester: student.semester,
      },
      pendingCount: pending,
      completedCount: completed,
      courses: overview,
    },
  });
});

module.exports = { getDashboard };
