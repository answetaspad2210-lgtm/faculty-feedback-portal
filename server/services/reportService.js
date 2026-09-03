// server/services/reportService.js
// All the MongoDB aggregation queries that power the admin dashboard
// charts and the reports page. Kept out of the controller so the
// aggregation pipelines are easy to find and adjust in one place.

const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

async function getDashboardSummary() {
  const [totalStudents, totalFaculty, totalCourses, totalFeedback] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Faculty.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    Feedback.countDocuments(),
  ]);

  // Pending = sum of each active student's assigned courses minus their submissions.
  const students = await Student.find({ isActive: true }).select('assignedCourses');
  const totalAssignments = students.reduce((sum, s) => sum + s.assignedCourses.length, 0);
  const feedbackPending = Math.max(totalAssignments - totalFeedback, 0);

  const ratingAgg = await Feedback.aggregate([
    { $group: { _id: null, avgRating: { $avg: '$overallRating' } } },
  ]);
  const averageRating = ratingAgg[0]?.avgRating || 0;

  return {
    totalStudents,
    totalFaculty,
    totalCourses,
    feedbackSubmitted: totalFeedback,
    feedbackPending,
    averageRating: Number(averageRating.toFixed(2)),
  };
}

// Chart 1: average rating per faculty member
async function getFacultyAverageRatings() {
  return Feedback.aggregate([
    { $group: { _id: '$faculty', avgRating: { $avg: '$overallRating' }, count: { $sum: 1 } } },
    { $lookup: { from: 'faculties', localField: '_id', foreignField: '_id', as: 'faculty' } },
    { $unwind: '$faculty' },
    {
      $project: {
        _id: 0,
        facultyName: '$faculty.name',
        avgRating: { $round: ['$avgRating', 2] },
        responses: '$count',
      },
    },
    { $sort: { avgRating: -1 } },
  ]);
}

// Chart 2: average rating per course
async function getCourseAverageRatings() {
  return Feedback.aggregate([
    { $group: { _id: '$course', avgRating: { $avg: '$overallRating' }, count: { $sum: 1 } } },
    { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    {
      $project: {
        _id: 0,
        courseCode: '$course.courseCode',
        courseName: '$course.courseName',
        avgRating: { $round: ['$avgRating', 2] },
        responses: '$count',
      },
    },
    { $sort: { avgRating: -1 } },
  ]);
}

// Chart 3: overall rating distribution (how many 1s, 2s, 3s, 4s, 5s)
async function getRatingDistribution() {
  const result = await Feedback.aggregate([
    { $group: { _id: '$overallRating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  // Normalize to always include all 5 buckets, even if count is 0.
  const distribution = [1, 2, 3, 4, 5].map((rating) => {
    const match = result.find((r) => r._id === rating);
    return { rating, count: match ? match.count : 0 };
  });
  return distribution;
}

// Chart 4: overall feedback completion percentage
async function getCompletionPercentage() {
  const students = await Student.find({ isActive: true }).select('assignedCourses');
  const totalAssignments = students.reduce((sum, s) => sum + s.assignedCourses.length, 0);
  const totalSubmitted = await Feedback.countDocuments();
  const percentage = totalAssignments === 0 ? 0 : Math.round((totalSubmitted / totalAssignments) * 100);
  return { completed: totalSubmitted, total: totalAssignments, percentage };
}

// Chart 5: category-wise average performance (needs the question's category,
// so we look it up via $lookup after unwinding the answers array).
async function getCategoryPerformance() {
  return Feedback.aggregate([
    { $unwind: '$answers' },
    {
      $lookup: {
        from: 'feedbackquestions',
        localField: 'answers.question',
        foreignField: '_id',
        as: 'questionInfo',
      },
    },
    { $unwind: '$questionInfo' },
    // Only average numeric-style answers (star/numeric/slider) - text/yes-no
    // answers aren't meaningful on a 1-5 scale.
    { $match: { 'questionInfo.questionType': { $in: ['star', 'numeric', 'slider'] } } },
    {
      $group: {
        _id: '$questionInfo.category',
        avgScore: { $avg: { $toDouble: '$answers.value' } },
      },
    },
    { $project: { _id: 0, category: '$_id', avgScore: { $round: ['$avgScore', 2] } } },
    { $sort: { category: 1 } },
  ]);
}

// Filterable report data for the Reports page.
async function getFilteredReport(filters) {
  const { department, semester, academicYear, course, faculty } = filters;

  const matchStage = {};
  if (semester) matchStage.semester = Number(semester);
  if (academicYear) matchStage.academicYear = academicYear;
  if (course) matchStage.course = course;
  if (faculty) matchStage.faculty = faculty;

  const pipeline = [{ $match: matchStage }];

  if (department) {
    pipeline.push(
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseInfo' } },
      { $unwind: '$courseInfo' },
      { $match: { 'courseInfo.department': department } }
    );
  }

  pipeline.push({
    $group: {
      _id: null,
      averageRating: { $avg: '$overallRating' },
      totalResponses: { $sum: 1 },
    },
  });

  const result = await Feedback.aggregate(pipeline);
  const summary = result[0] || { averageRating: 0, totalResponses: 0 };

  return {
    averageRating: Number((summary.averageRating || 0).toFixed(2)),
    totalResponses: summary.totalResponses || 0,
  };
}

module.exports = {
  getDashboardSummary,
  getFacultyAverageRatings,
  getCourseAverageRatings,
  getRatingDistribution,
  getCompletionPercentage,
  getCategoryPerformance,
  getFilteredReport,
};
