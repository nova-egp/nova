import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-navy-800 text-cream-200 mt-32">
      <div className="rail rail-light" />
      <div className="max-w-content mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/logo.jpg" alt="NOVA" className="h-8 w-8 object-cover" />
              <span className="font-display text-lg tracking-wide">NOVA</span>
            </div>
            <p className="text-sm text-cream-300/70 max-w-xs leading-relaxed">
              Resin. Reimagined. Handcrafted in Egypt, one T-Head at a time.
            </p>
          </div>
          <div>
            <p className="eyebrow text-cream-300/50 mb-4">Shop</p>
            <ul className="space-y-3 text-sm text-cream-300/80">
              <li><Link to="/shop" className="hover:text-gold transition-colors">All T-Heads</Link></li>
              <li><Link to="/custom" className="hover:text-gold transition-colors">Custom order</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-cream-300/50 mb-4">Account</p>
            <ul className="space-y-3 text-sm text-cream-300/80">
              <li><Link to="/account/login" className="hover:text-gold transition-colors">Sign in</Link></li>
              <li><Link to="/account/register" className="hover:text-gold transition-colors">Create account</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About NOVA</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-cream-200/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-cream-300/50">
          <span>© {new Date().getFullYear()} NOVA. All rights reserved.</span>
          <span className="font-mono">Cairo, Egypt</span>
        </div>
      </div>
    </footer>
  );
}
