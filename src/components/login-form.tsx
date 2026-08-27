'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError ?? '');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      router.push(next || '/dashboard');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid password');
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className='space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm'
    >
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter admin password'
          disabled={loading}
        />
      </div>
      {error && (
        <div className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700'>
          {error}
        </div>
      )}
      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Sign in'}
      </Button>
    </form>
  );
}
