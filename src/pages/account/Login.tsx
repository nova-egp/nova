import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await login(phone.trim(), password);
    setSubmitting(false);
    if (res.ok) navigate('/account/orders');
    else setError(res.error ?? 'Something went wrong.');
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-24">
      <div className="max-w-sm mx-auto">
        <p className="eyebrow mb-3">Account</p>
        <h1 className="font-display text-3xl text-navy-800 mb-8">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Phone number" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="text-sm text-navy-500 mt-6">
          New here?{' '}
          <Link to="/account/register" className="text-navy-800 underline">Create an account</Link>
        </p>
        <p className="text-sm text-navy-500 mt-3">
          Prefer not to sign in?{' '}
          <Link to="/checkout" className="text-navy-800 underline">Checkout as guest</Link>
        </p>
      </div>
    </div>
  );
}
