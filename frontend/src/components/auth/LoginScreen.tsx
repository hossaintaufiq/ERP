'use client';

import React, { useState } from 'react';
import { Factory, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LoginScreen({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('owner@garmentserp.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Login failed. Is the API running on :4000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-canvas-dark p-6">
      <div className="w-full max-w-md panel p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-glow">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100">Garments ERP</h1>
            <p className="text-xs text-stone-500">Enterprise Manufacturing Platform</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Email</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                className="input-field pl-9"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                className="input-field pl-9"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="text-xs text-status-danger bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-[11px] text-stone-500 leading-relaxed">
          Demo: <span className="font-mono text-brand-700 dark:text-brand-400">owner@garmentserp.com</span> /{' '}
          <span className="font-mono text-brand-700 dark:text-brand-400">Password@123</span>
        </p>
      </div>
    </div>
  );
}
