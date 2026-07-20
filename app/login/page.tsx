'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-chalk flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border-1 border-asphalt p-8 shadow-brutalist">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-extrabold uppercase text-asphalt tracking-tight">
            naaride ADMIN
          </h1>
          <p className="text-sm font-mono text-gray-600 mt-1 uppercase">Urban Transit Control Center</p>
        </div>

        {error && (
          <div className="bg-roadCoral/10 border-1 border-roadCoral text-roadCoral p-3 mb-6 font-mono text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-asphalt mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-chalk border-1 border-asphalt px-4 py-3 text-sm focus:outline-none focus:bg-white font-mono"
              placeholder="admin@naaride.com"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-asphalt mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-chalk border-1 border-asphalt px-4 py-3 text-sm focus:outline-none focus:bg-white font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-brutalist-primary py-3 flex items-center justify-center font-display text-lg tracking-wider"
          >
            {loading ? 'Authenticating...' : 'ACCESS CONTROL CENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}
