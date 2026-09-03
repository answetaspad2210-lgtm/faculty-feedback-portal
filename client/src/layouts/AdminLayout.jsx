// client/src/layouts/AdminLayout.jsx
// Shared shell for all admin pages: a left sidebar + content area.
// Edit this file to change the admin-side navigation.
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/faculty', label: 'Faculty' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/questions', label: 'Feedback Questions' },
  { to: '/admin/reports', label: 'Reports' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200">
          <p className="font-semibold text-primary-700">Admin Panel</p>
          <p className="text-xs text-slate-400 mt-0.5">{user?.name}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <button onClick={handleLogout} className="btn-secondary w-full text-sm py-1.5">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
