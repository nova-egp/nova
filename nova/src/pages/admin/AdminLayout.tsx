import React from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/custom-orders', label: 'Custom Orders' },
  { to: '/admin/inventory', label: 'Inventory' },
];

export default function AdminLayout() {
  const { session, logout } = useAuth();

  // Secure admin area: anyone not logged in, or logged in without the
  // admin flag, is bounced to the dedicated admin login screen. This check
  // runs on every render of every nested admin route via <Outlet />.
  if (!session || !session.isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-navy-900 text-cream-200 flex">
      <aside className="w-60 shrink-0 bg-navy-800 flex flex-col">
        <div className="p-6">
          <p className="font-display text-lg tracking-wide">NOVA</p>
          <p className="eyebrow text-cream-300/40 mt-1">Admin</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-gold/15 text-gold' : 'text-cream-300/70 hover:bg-cream-200/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-cream-200/10">
          <button onClick={logout} className="block w-full text-left px-3 py-2.5 text-sm text-cream-300/50 hover:text-cream-200">
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
