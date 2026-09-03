// server/controllers/courseController.js
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');

// GET /api/courses  (supports optional ?department=&semester= filters)
const getAllCourses = asyncHandler(async (req, res) => {
  const { department, semester } = req.query;
  const filter = { isActive: true };
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);

  const courses = await Course.find(filter).populate('faculty', 'name facultyId').sort({ courseCode: 1 });
  res.status(200).json({ success: true, data: courses });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('faculty', 'name facultyId');
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, data: course });
});

// POST /api/admin/courses
const createCourse = asyncHandler(async (req, res) => {
  const { courseCode, courseName, department, semester, faculty, academicYear } = req.body;
  if (!courseCode || !courseName || !department || !semester || !faculty || !academicYear) {
    throw new ApiError(400, 'All course fields are required');
  }

  const facultyExists = await Faculty.findById(faculty);
  if (!facultyExists) throw new ApiError(400, 'Selected faculty does not exist');

  const course = await Course.create({ courseCode, courseName, department, semester, faculty, academicYear });

  // Keep the faculty's course list in sync (used for their profile view).
  facultyExists.courses.push(course._id);
  await facultyExists.save();

  res.status(201).json({ success: true, data: course });
});

// PUT /api/admin/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, data: course });
});

// DELETE /api/admin/courses/:id  (soft delete)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, message: 'Course deactivated' });
});

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
