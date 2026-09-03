// server/controllers/facultyController.js
// Admin-only CRUD for faculty records.
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Faculty = require('../models/Faculty');

// GET /api/faculty  (also used by students to see faculty names)
const getAllFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, data: faculty });
});

// GET /api/admin/faculty/:id
const getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).populate('courses', 'courseCode courseName');
  if (!faculty) throw new ApiError(404, 'Faculty not found');
  res.status(200).json({ success: true, data: faculty });
});

// POST /api/admin/faculty
const createFaculty = asyncHandler(async (req, res) => {
  const { facultyId, name, email, department, designation } = req.body;
  if (!facultyId || !name || !email || !department) {
    throw new ApiError(400, 'facultyId, name, email, and department are required');
  }
  const faculty = await Faculty.create({ facultyId, name, email, department, designation });
  res.status(201).json({ success: true, data: faculty });
});

// PUT /api/admin/faculty/:id
const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faculty) throw new ApiError(404, 'Faculty not found');
  res.status(200).json({ success: true, data: faculty });
});

// DELETE /api/admin/faculty/:id  (soft delete - deactivate)
const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!faculty) throw new ApiError(404, 'Faculty not found');
  res.status(200).json({ success: true, message: 'Faculty deactivated' });
});

module.exports = { getAllFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty };
