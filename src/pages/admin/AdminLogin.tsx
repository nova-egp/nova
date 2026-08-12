import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (session?.isAdmin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await login(phone.trim(), password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Something went wrong.');
      return;
    }
    // Re-check admin flag after login resolves via a fresh navigate;
    // AdminLayout below will bounce non-admins back here.
    navigate('/admin');
  }

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center px-5">
      <div className="max-w-sm w-full">
        <p className="eyebrow text-gold mb-3">NOVA</p>
        <h1 className="font-display text-2xl text-cream-200 mb-8">Admin sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label !text-cream-300/60">Phone number</label>
            <input
              className="input !bg-navy-700 !border-cream-200/20 !text-cream-200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="label !text-cream-300/60">Password</label>
            <input
              type="password"
              className="input !bg-navy-700 !border-cream-200/20 !text-cream-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
