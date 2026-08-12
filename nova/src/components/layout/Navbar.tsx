import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/custom', label: 'Custom' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream-200/95 backdrop-blur border-b border-navy-800/10">
      <div className="max-w-content mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img src="/assets/logo.jpg" alt="NOVA" className="h-9 w-9 object-cover" />
            <span className="font-display text-xl tracking-wide text-navy-800">NOVA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors ${
                    isActive ? 'text-navy-800 font-medium' : 'text-navy-500 hover:text-navy-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link
              to={session ? '/account' : '/account/login'}
              className="hidden sm:block text-sm text-navy-600 hover:text-navy-800 transition-colors"
            >
              {session ? session.fullName.split(' ')[0] : 'Account'}
            </Link>
            <Link to="/cart" className="relative text-sm text-navy-800">
              <span className="tracking-wide">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-gold text-navy-900 text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-navy-800"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-navy-800/10 bg-cream-200">
          <div className="px-5 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-sm text-navy-700"
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={session ? '/account' : '/account/login'}
              onClick={() => setOpen(false)}
              className="text-sm text-navy-700"
            >
              {session ? session.fullName.split(' ')[0] : 'Account'}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
