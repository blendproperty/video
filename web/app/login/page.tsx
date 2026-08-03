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
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-visual-glow" aria-hidden="true" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/midpoint-lockup.svg" alt="Midpoint" className="auth-visual-logo" />

        <div className="auth-visual-content">
          <svg
            className="auth-play-badge"
            width="88"
            height="88"
            viewBox="0 0 88 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="44" cy="44" r="43" stroke="var(--mp-cyan)" strokeWidth="2" opacity="0.5" />
            <circle cx="44" cy="44" r="34" fill="rgba(57, 234, 230, 0.12)" />
            <path d="M36 28L62 44L36 60V28Z" fill="var(--mp-cyan)" />
          </svg>

          <h1 className="auth-visual-title">
            Property listings,
            <br />
            turned into video.
          </h1>
          <p className="auth-visual-copy">
            Pick a listing, pick the photos — Video Studio renders a branded promo in minutes.
          </p>

          <div className="auth-filmstrip" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="auth-page">
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
    </div>
  );
}
