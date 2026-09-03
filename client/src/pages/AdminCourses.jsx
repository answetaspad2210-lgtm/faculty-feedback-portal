// client/src/pages/AdminCourses.jsx
// Admin page to view, add, and deactivate courses. Assigning a course to
// a faculty member happens right here in the "Faculty" dropdown of the
// add-course form - this is the course-faculty mapping feature.
// Edit this file to change how course management works.

import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import EmptyState from '../components/EmptyState';

const EMPTY_FORM = { courseCode: '', courseName: '', department: '', semester: '', faculty: '', academicYear: '2025-2026' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function loadData() {
    setLoading(true);
    Promise.all([adminService.getCourses(), adminService.getFaculty()])
      .then(([courseData, facultyData]) => {
        setCourses(courseData);
        setFacultyList(facultyData);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminService.createCourse({ ...form, semester: Number(form.semester) });
      setSuccess('Course added successfully.');
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(id) {
    if (!window.confirm('Deactivate this course?')) return;
    try {
      await adminService.deleteCourse(id);
      setSuccess('Course deactivated.');
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Courses</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Course Code</label>
            <input className="input-field" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Course Name</label>
            <input className="input-field" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Department</label>
            <input className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Semester</label>
            <input type="number" min="1" max="12" className="input-field" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Faculty</label>
            <select className="input-field" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} required>
              <option value="">Select faculty...</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Academic Year</label>
            <input className="input-field" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} placeholder="2025-2026" required />
          </div>
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses yet" message="Add your first course using the button above." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Faculty</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Semester</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{c.courseCode}</td>
                  <td className="px-4 py-3">{c.courseName}</td>
                  <td className="px-4 py-3 text-slate-500">{c.faculty?.name || '-'}</td>
                  <td className="px-4 py-3">{c.department}</td>
                  <td className="px-4 py-3">{c.semester}</td>
                  <td className="px-4 py-3">{c.academicYear}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeactivate(c._id)} className="text-xs text-red-600 hover:underline">
                      Deactivate
                    </button>
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
