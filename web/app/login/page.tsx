'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (!res || res.error) {
      setError('Invalid email or password.');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="auth-page">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/midpoint-lockup.svg" alt="Midpoint" className="auth-logo" />
      <form className="auth-card" onSubmit={onSubmit}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--mp-grey-200)', margin: '0 0 4px' }}>
          Video Studio
        </h1>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
