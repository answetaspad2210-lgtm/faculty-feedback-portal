// server/services/feedbackService.js
// Contains the core business rules for submitting feedback:
//  - student is actually assigned to the course
//  - all active questions are answered, within valid ranges
//  - no duplicate submission for the same course/faculty/period
//
// The controller stays thin; all of this logic lives here so it's easy
// to test and reason about independently of Express.

const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const Student = require('../models/Student');
const FeedbackQuestion = require('../models/FeedbackQuestion');
const ApiError = require('../utils/ApiError');
const { QUESTION_TYPES } = require('../config/constants');

async function submitFeedback(studentId, payload) {
  const { courseId, answers, overallRating, anonymous } = payload;

  if (!courseId || !Array.isArray(answers) || answers.length === 0 || !overallRating) {
    throw new ApiError(400, 'courseId, answers, and overallRating are required');
  }

  if (overallRating < 1 || overallRating > 5) {
    throw new ApiError(400, 'overallRating must be between 1 and 5');
  }

  // 1. Confirm the course exists and the student is assigned to it.
  const [course, student] = await Promise.all([
    Course.findById(courseId),
    Student.findById(studentId),
  ]);

  if (!course || !course.isActive) throw new ApiError(404, 'Course not found');
  if (!student) throw new ApiError(404, 'Student not found');

  const isAssigned = student.assignedCourses.some((c) => c.toString() === courseId);
  if (!isAssigned) {
    throw new ApiError(403, 'You are not assigned to this course');
  }

  // 2. Validate every active question is answered with a value in range.
  const activeQuestions = await FeedbackQuestion.find({ isActive: true });
  const answersByQuestionId = new Map(answers.map((a) => [String(a.question), a.value]));

  for (const q of activeQuestions) {
    const value = answersByQuestionId.get(String(q._id));

    if (value === undefined || value === null || value === '') {
      throw new ApiError(400, `Missing answer for required question: "${q.question}"`);
    }

    if ([QUESTION_TYPES.STAR, QUESTION_TYPES.NUMERIC, QUESTION_TYPES.SLIDER].includes(q.questionType)) {
      const numeric = Number(value);
      if (Number.isNaN(numeric) || numeric < q.minValue || numeric > q.maxValue) {
        throw new ApiError(
          400,
          `Answer for "${q.question}" must be between ${q.minValue} and ${q.maxValue}`
        );
      }
    }

    if (q.questionType === QUESTION_TYPES.MULTIPLE_CHOICE && !q.options.includes(value)) {
      throw new ApiError(400, `Invalid option selected for "${q.question}"`);
    }
  }

  // 3. Attempt the insert. The unique index on Feedback (student + course +
  // faculty + academicYear + semester) is the final safeguard against
  // duplicates even under concurrent requests.
  try {
    const feedback = await Feedback.create({
      student: studentId,
      course: course._id,
      faculty: course.faculty,
      answers,
      overallRating,
      anonymous: Boolean(anonymous),
      academicYear: course.academicYear,
      semester: course.semester,
    });
    return feedback;
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, 'You have already submitted feedback for this course');
    }
    throw err;
  }
}

// Returns each assigned course with a pending/completed status for the dashboard.
async function getStudentFeedbackOverview(studentId) {
  const student = await Student.findById(studentId).populate({
    path: 'assignedCourses',
    populate: { path: 'faculty', select: 'name' },
  });

  if (!student) throw new ApiError(404, 'Student not found');

  const submitted = await Feedback.find({ student: studentId }).select('course');
  const submittedCourseIds = new Set(submitted.map((f) => f.course.toString()));

  return student.assignedCourses.map((course) => ({
    courseId: course._id,
    courseCode: course.courseCode,
    courseName: course.courseName,
    facultyName: course.faculty?.name || 'Unassigned',
    semester: course.semester,
    status: submittedCourseIds.has(course._id.toString()) ? 'completed' : 'pending',
  }));
}

module.exports = { submitFeedback, getStudentFeedbackOverview };
