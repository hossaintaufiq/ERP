'use client';

import React, { useState } from 'react';
import { Factory, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Login failed. Is the API running on :4000?';
      setError(typeof msg === 'string' ? msg : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(215 62% 28% / 0.08), transparent 55%), linear-gradient(180deg, hsl(214 28% 97%), hsl(214 24% 94%))',
        }}
      />
      <Card className="relative w-full max-w-md shadow-panel border-border/80">
        <CardHeader className="space-y-3 sm:space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm shrink-0">
              <Factory className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Garments ERP</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Enterprise Manufacturing Platform</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit">
            Secure JWT access
          </Badge>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 pt-0">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  className="pl-9 h-10"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  className="pl-9 h-10"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs sm:text-sm break-words">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading} className="w-full h-10">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-4 break-all">
            Demo:{' '}
            <span className="font-mono text-primary">owner@garmentserp.com</span> /{' '}
            <span className="font-mono text-primary">Password@123</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
