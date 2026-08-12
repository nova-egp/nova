import React from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AccountLayout() {
  const { session, logout } = useAuth();

  if (!session) return <Navigate to="/account/login" replace />;

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="font-display text-3xl md:text-4xl text-navy-800 mb-10">
        Welcome back, {session.fullName.split(' ')[0]}
      </h1>
      <div className="grid md:grid-cols-4 gap-12">
        <nav className="space-y-1">
          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `block px-4 py-3 text-sm ${isActive ? 'bg-navy-800 text-cream-200' : 'text-navy-600 hover:bg-navy-800/5'}`
            }
          >
            Order history
          </NavLink>
          {session.isAdmin && (
            <NavLink
              to="/admin"
              className="block px-4 py-3 text-sm text-navy-600 hover:bg-navy-800/5"
            >
              Admin dashboard
            </NavLink>
          )}
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-3 text-sm text-navy-500 hover:bg-navy-800/5"
          >
            Sign out
          </button>
        </nav>
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
