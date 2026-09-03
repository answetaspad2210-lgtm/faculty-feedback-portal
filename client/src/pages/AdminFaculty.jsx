// client/src/pages/AdminFaculty.jsx
// Admin page to view, add, edit, and deactivate faculty records.
// Edit this file to change how faculty management works in the admin panel.

import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';
import { getErrorMessage } from '../utils/getErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import EmptyState from '../components/EmptyState';

const EMPTY_FORM = { facultyId: '', name: '', email: '', department: '', designation: '' };

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function loadFaculty() {
    setLoading(true);
    adminService
      .getFaculty()
      .then(setFaculty)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(loadFaculty, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminService.createFaculty(form);
      setSuccess('Faculty member added successfully.');
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadFaculty();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(id) {
    if (!window.confirm('Deactivate this faculty member?')) return;
    try {
      await adminService.deleteFaculty(id);
      setSuccess('Faculty member deactivated.');
      loadFaculty();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Faculty</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Faculty'}
        </button>
      </div>

      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Faculty ID</label>
            <input className="input-field" value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Full Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Email</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Department</label>
            <input className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          </div>
          <div>
            <label className="label-text">Designation</label>
            <input className="input-field" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Assistant Professor" />
          </div>
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Faculty'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : faculty.length === 0 ? (
        <EmptyState title="No faculty yet" message="Add your first faculty member using the button above." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Faculty ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{f.facultyId}</td>
                  <td className="px-4 py-3">{f.name}</td>
                  <td className="px-4 py-3 text-slate-500">{f.email}</td>
                  <td className="px-4 py-3">{f.department}</td>
                  <td className="px-4 py-3">{f.designation}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeactivate(f._id)} className="text-xs text-red-600 hover:underline">
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
