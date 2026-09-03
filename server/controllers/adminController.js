// server/controllers/adminController.js
const asyncHandler = require('../utils/asyncHandler');
const reportService = require('../services/reportService');

// GET /api/admin/dashboard - the 5 charts + summary cards in one call
const getDashboard = asyncHandler(async (req, res) => {
  const [summary, facultyRatings, courseRatings, ratingDistribution, completion, categoryPerformance] =
    await Promise.all([
      reportService.getDashboardSummary(),
      reportService.getFacultyAverageRatings(),
      reportService.getCourseAverageRatings(),
      reportService.getRatingDistribution(),
      reportService.getCompletionPercentage(),
      reportService.getCategoryPerformance(),
    ]);

  res.status(200).json({
    success: true,
    data: { summary, facultyRatings, courseRatings, ratingDistribution, completion, categoryPerformance },
  });
});

// GET /api/admin/reports?department=&semester=&academicYear=&course=&faculty=
const getReports = asyncHandler(async (req, res) => {
  const report = await reportService.getFilteredReport(req.query);
  res.status(200).json({ success: true, data: report });
});

module.exports = { getDashboard, getReports };
