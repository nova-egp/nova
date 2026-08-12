import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    setError('');
    const res = await register({ fullName: fullName.trim(), phone: phone.trim(), password, email: email.trim() || undefined });
    setSubmitting(false);
    if (res.ok) navigate('/account/orders');
    else setError(res.error ?? 'Something went wrong.');
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-24">
      <div className="max-w-sm mx-auto">
        <p className="eyebrow mb-3">Account</p>
        <h1 className="font-display text-3xl text-navy-800 mb-8">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Phone number" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <p className="text-sm text-navy-500 mt-6">
          Already have an account?{' '}
          <Link to="/account/login" className="text-navy-800 underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
