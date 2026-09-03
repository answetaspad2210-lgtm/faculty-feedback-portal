// client/src/pages/AdminDashboard.jsx
// The admin analytics dashboard: summary cards + 5 charts sourced from
// server/services/reportService.js aggregation queries.
// Edit this file to change which charts appear or how they're laid out.

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { getAdminDashboard } from '../services/adminService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

const PIE_COLORS = ['#3b4fbf', '#6b7fd7', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

function SummaryCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <ErrorBanner message={error} />;

  const { summary, facultyRatings, courseRatings, ratingDistribution, completion, categoryPerformance } = data;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Admin Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <SummaryCard label="Total Students" value={summary.totalStudents} />
        <SummaryCard label="Total Faculty" value={summary.totalFaculty} />
        <SummaryCard label="Total Courses" value={summary.totalCourses} />
        <SummaryCard label="Feedback Submitted" value={summary.feedbackSubmitted} />
        <SummaryCard label="Feedback Pending" value={summary.feedbackPending} />
        <SummaryCard label="Average Rating" value={summary.averageRating} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average faculty rating */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Average Rating by Faculty</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facultyRatings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
              <XAxis dataKey="facultyName" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#3b4fbf" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Course-wise average rating */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Average Rating by Course</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseRatings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
              <XAxis dataKey="courseCode" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#6b7fd7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Rating distribution */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={ratingDistribution}
                dataKey="count"
                nameKey="rating"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.rating}★`}
              >
                {ratingDistribution.map((entry, index) => (
                  <Cell key={entry.rating} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Feedback completion percentage */}
        <div className="card flex flex-col items-center justify-center">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 self-start">Feedback Completion</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completed', value: completion.completed },
                  { name: 'Remaining', value: Math.max(completion.total - completion.completed, 0) },
                ]}
                dataKey="value"
                innerRadius={60}
                outerRadius={85}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#3b4fbf" />
                <Cell fill="#e2e8f0" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-2xl font-semibold text-primary-700 -mt-4">{completion.percentage}%</p>
        </div>

        {/* Chart 5: Category-wise performance */}
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Category-wise Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={categoryPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Radar dataKey="avgScore" stroke="#3b4fbf" fill="#3b4fbf" fillOpacity={0.4} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
