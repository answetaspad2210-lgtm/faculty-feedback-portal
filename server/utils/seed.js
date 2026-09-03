// server/utils/seed.js
// Populates the database with demo data so the project is runnable
// immediately after setup. Run with: npm run seed (from /server)
//
// WARNING: This wipes existing data in the relevant collections before
// inserting fresh sample data. Do not run against a production database.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const FeedbackQuestion = require('../models/FeedbackQuestion');
const Feedback = require('../models/Feedback');

const ACADEMIC_YEAR = '2025-2026';

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Admin.deleteMany({}),
    Student.deleteMany({}),
    Faculty.deleteMany({}),
    Course.deleteMany({}),
    FeedbackQuestion.deleteMany({}),
    Feedback.deleteMany({}),
  ]);

  // ---- Admin ----
  // NOTE: these are DEVELOPMENT/DEMO credentials only.
  // Change them immediately before deploying this project anywhere real.
  console.log('Creating demo admin...');
  await Admin.create({
    name: 'Portal Administrator',
    email: 'admin@example.com',
    password: 'Admin@123',
  });

  // ---- Faculty ----
  console.log('Creating sample faculty...');
  const facultyDocs = await Faculty.insertMany([
    { facultyId: 'FAC001', name: 'Dr. Anita Sharma', email: 'anita.sharma@example.edu', department: 'Computer Science', designation: 'Professor' },
    { facultyId: 'FAC002', name: 'Dr. Rohan Mehta', email: 'rohan.mehta@example.edu', department: 'Computer Science', designation: 'Associate Professor' },
    { facultyId: 'FAC003', name: 'Dr. Priya Nair', email: 'priya.nair@example.edu', department: 'Computer Science', designation: 'Assistant Professor' },
    { facultyId: 'FAC004', name: 'Dr. Vikram Rao', email: 'vikram.rao@example.edu', department: 'Computer Science', designation: 'Professor' },
    { facultyId: 'FAC005', name: 'Dr. Sneha Iyer', email: 'sneha.iyer@example.edu', department: 'Computer Science', designation: 'Assistant Professor' },
  ]);

  // ---- Courses ----
  console.log('Creating sample courses...');
  const courseData = [
    { courseCode: 'CS301', courseName: 'Data Structures & Algorithms', department: 'Computer Science', semester: 3, faculty: facultyDocs[0]._id, academicYear: ACADEMIC_YEAR },
    { courseCode: 'CS302', courseName: 'Database Management Systems', department: 'Computer Science', semester: 3, faculty: facultyDocs[1]._id, academicYear: ACADEMIC_YEAR },
    { courseCode: 'CS401', courseName: 'Operating Systems', department: 'Computer Science', semester: 4, faculty: facultyDocs[2]._id, academicYear: ACADEMIC_YEAR },
    { courseCode: 'CS402', courseName: 'Computer Networks', department: 'Computer Science', semester: 4, faculty: facultyDocs[3]._id, academicYear: ACADEMIC_YEAR },
    { courseCode: 'CS403', courseName: 'Software Engineering', department: 'Computer Science', semester: 4, faculty: facultyDocs[4]._id, academicYear: ACADEMIC_YEAR },
  ];
  const courseDocs = await Course.insertMany(courseData);

  // Link courses back onto their faculty record.
  for (const course of courseDocs) {
    await Faculty.findByIdAndUpdate(course.faculty, { $push: { courses: course._id } });
  }

  // ---- Students ----
  console.log('Creating sample students...');
  const studentSeedData = [
    { studentId: 'STU001', name: 'Aarav Patel', email: 'aarav.patel@example.edu', password: 'Student@123', department: 'Computer Science', semester: 3 },
    { studentId: 'STU002', name: 'Diya Kapoor', email: 'diya.kapoor@example.edu', password: 'Student@123', department: 'Computer Science', semester: 3 },
    { studentId: 'STU003', name: 'Kabir Singh', email: 'kabir.singh@example.edu', password: 'Student@123', department: 'Computer Science', semester: 4 },
    { studentId: 'STU004', name: 'Meera Joshi', email: 'meera.joshi@example.edu', password: 'Student@123', department: 'Computer Science', semester: 4 },
    { studentId: 'STU005', name: 'Rehan Ali', email: 'rehan.ali@example.edu', password: 'Student@123', department: 'Computer Science', semester: 3 },
  ];

  // Assign sem-3 students to the two sem-3 courses, sem-4 students to the three sem-4 courses.
  const sem3CourseIds = courseDocs.filter((c) => c.semester === 3).map((c) => c._id);
  const sem4CourseIds = courseDocs.filter((c) => c.semester === 4).map((c) => c._id);

  const studentDocs = [];
  for (const data of studentSeedData) {
    const assignedCourses = data.semester === 3 ? sem3CourseIds : sem4CourseIds;
    // .create() (not insertMany) so the pre-save password-hashing hook runs.
    const student = await Student.create({ ...data, assignedCourses });
    studentDocs.push(student);
  }

  // ---- Feedback Questions ----
  console.log('Creating sample feedback questions...');
  const questionData = [
    { category: 'Course Content', question: 'The course content is well structured.', questionType: 'star', order: 1 },
    { category: 'Course Content', question: 'The course objectives are clearly explained.', questionType: 'star', order: 2 },
    { category: 'Course Content', question: 'The course content is relevant to the subject.', questionType: 'star', order: 3 },
    { category: 'Faculty Teaching', question: 'The faculty explains concepts clearly.', questionType: 'star', order: 1 },
    { category: 'Faculty Teaching', question: 'The faculty encourages questions.', questionType: 'yes_no', order: 2 },
    { category: 'Faculty Teaching', question: 'The faculty uses appropriate teaching methods.', questionType: 'numeric', order: 3 },
    { category: 'Faculty Teaching', question: 'The faculty is well prepared for lectures.', questionType: 'star', order: 4 },
    { category: 'Interaction', question: 'The faculty maintains a positive classroom environment.', questionType: 'slider', order: 1 },
    { category: 'Interaction', question: 'Students are encouraged to participate.', questionType: 'yes_no', order: 2 },
    { category: 'Assessment', question: 'Assessments are relevant to the course.', questionType: 'star', order: 1 },
    { category: 'Assessment', question: 'Evaluation is fair and transparent.', questionType: 'star', order: 2 },
    { category: 'Overall', question: 'Any additional comments about this course or faculty?', questionType: 'text', order: 1 },
  ];
  const questionDocs = await FeedbackQuestion.insertMany(questionData);

  console.log('Seed complete!');
  console.log('----------------------------------------');
  console.log('Demo admin login:');
  console.log('  email: admin@example.com');
  console.log('  password: Admin@123');
  console.log('Demo student login (any of STU001-STU005):');
  console.log('  email: aarav.patel@example.edu');
  console.log('  password: Student@123');
  console.log('----------------------------------------');
  console.log('Remember: these are DEMO credentials. Change them before any real deployment.');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
