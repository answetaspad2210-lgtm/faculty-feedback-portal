// client/src/pages/AdminReports.jsx
// Filterable reports page - lets admins narrow feedback results down by
// department, semester, academic year, course, and faculty, and see the
// resulting average rating + response count.
// Edit this file to change the reports/filtering UI.

import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

const EMPTY_FILTERS = { department: '', semester: '', academicYear: '', course: '', faculty: '' };

export default function AdminReports() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminService.getCourses(), adminService.getFaculty()])
      .then(([c, f]) => {
        setCourses(c);
        setFacultyList(f);
      })
      .catch((err) => setError(getErrorMessage(err)));
    runReport(EMPTY_FILTERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runReport(activeFilters) {
    setLoading(true);
    setError('');
    // Drop empty-string filters so they don't get sent as query params.
    const cleaned = Object.fromEntries(Object.entries(activeFilters).filter(([, v]) => v));
    adminService
      .getReports(cleaned)
      .then(setReport)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function handleApply(e) {
    e.preventDefault();
    runReport(filters);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    runReport(EMPTY_FILTERS);
  }

  // CSV export of the current summary - a lightweight client-side export
  // that needs no extra backend work.
  function handleExportCsv() {
    if (!report) return;
    const rows = [
      ['Metric', 'Value'],
      ['Average Rating', report.averageRating],
      ['Total Responses', report.totalResponses],
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feedback-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Reports</h1>

      <ErrorBanner message={error} />

      <form onSubmit={handleApply} className="card mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="label-text">Department</label>
          <input className="input-field" value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)} placeholder="Any" />
        </div>
        <div>
          <label className="label-text">Semester</label>
          <input type="number" className="input-field" value={filters.semester} onChange={(e) => handleFilterChange('semester', e.target.value)} placeholder="Any" />
        </div>
        <div>
          <label className="label-text">Academic Year</label>
          <input className="input-field" value={filters.academicYear} onChange={(e) => handleFilterChange('academicYear', e.target.value)} placeholder="2025-2026" />
        </div>
        <div>
          <label className="label-text">Course</label>
          <select className="input-field" value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)}>
            <option value="">Any</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseCode}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Faculty</label>
          <select className="input-field" value={filters.faculty} onChange={(e) => handleFilterChange('faculty', e.target.value)}>
            <option value="">Any</option>
            {facultyList.map((f) => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2 md:col-span-5 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
          <button type="submit" className="btn-primary">Apply Filters</button>
        </div>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : report ? (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
            <button onClick={handleExportCsv} className="btn-secondary text-xs py-1.5 px-3">
              Export CSV
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Average Rating</p>
              <p className="text-2xl font-semibold text-primary-700 mt-1">{report.averageRating || 0} / 5</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Responses</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{report.totalResponses}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
