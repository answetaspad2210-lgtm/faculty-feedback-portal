// client/src/pages/StudentDashboard.jsx
// The student's home page: welcome summary + list of assigned courses
// with their feedback status (pending/completed).
// Edit this file to change the student dashboard UI.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentDashboard } from '../services/studentService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Welcome, {data.student.name}
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        {data.student.department} · Semester {data.student.semester}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 my-6">
        <div className="card">
          <p className="text-sm text-slate-500">Pending Feedback</p>
          <p className="text-2xl font-semibold text-amber-500 mt-1">{data.pendingCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Completed Feedback</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{data.completedCount}</p>
        </div>
      </div>

      <h2 className="text-base font-semibold text-slate-700 mb-3">Your Courses</h2>

      {data.courses.length === 0 ? (
        <EmptyState title="No courses assigned yet" message="Check back once your admin assigns your courses." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Course Code</th>
                <th className="px-4 py-3 font-medium">Course Name</th>
                <th className="px-4 py-3 font-medium">Faculty</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((course) => (
                <tr key={course.courseId} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{course.courseCode}</td>
                  <td className="px-4 py-3 text-slate-600">{course.courseName}</td>
                  <td className="px-4 py-3 text-slate-600">{course.facultyName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {course.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {course.status === 'pending' ? (
                      <Link to={`/student/feedback/${course.courseId}`} className="btn-primary text-xs py-1.5 px-3">
                        Give Feedback
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Submitted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
