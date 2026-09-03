// server/controllers/adminStudentController.js
// Admin-only CRUD for student accounts (separate file from studentController.js,
// which handles the STUDENT's own dashboard, to keep "manage others" and
// "manage myself" concerns apart).
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Student = require('../models/Student');

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().populate('assignedCourses', 'courseCode courseName').sort({ name: 1 });
  res.status(200).json({ success: true, data: students });
});

const createStudent = asyncHandler(async (req, res) => {
  const { studentId, name, email, password, department, semester } = req.body;
  if (!studentId || !name || !email || !password || !department || !semester) {
    throw new ApiError(400, 'All student fields are required');
  }
  // Password is hashed automatically by the pre-save hook in the Student model.
  const student = await Student.create({ studentId, name, email, password, department, semester });
  res.status(201).json({ success: true, data: { id: student._id, name: student.name, email: student.email } });
});

const updateStudent = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.password; // password changes should go through a dedicated flow, not a plain PUT
  const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!student) throw new ApiError(404, 'Student not found');
  res.status(200).json({ success: true, data: student });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!student) throw new ApiError(404, 'Student not found');
  res.status(200).json({ success: true, message: 'Student deactivated' });
});

module.exports = { getAllStudents, createStudent, updateStudent, deleteStudent };
