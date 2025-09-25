'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define brand colours
const BRAND = {
  charcoal: '#2f2f31',
};

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleGoogle() {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('from') || '/';
      await signIn('google', { callbackUrl: to });
    } finally {
      setLoading(false);
    }
  }

  async function handleCredentials(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        alert('Authentication failed. Please check your credentials.');
      } else {
        router.push(result.url || '/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Background image at 80% opacity behind everything else */}
      <img
        src="/43.png"
        alt="Joyzze grooming background"
        className="absolute inset-0 w-full h-full object-cover opacity-80 -z-10"
      />

      {/* Header */}
      <header className="w-full text-xs text-white" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/dog-5.png" width={24} height={24} alt="Joyzze logo" className="rounded" />
            <span>Joyzze — Dog Groomer</span>
          </div>
          <a href="https://joyzze.com" className="opacity-80 hover:opacity-100">
            joyzze.com
          </a>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/dog-5.png"
                alt="Joyzze logo"
                className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5"
              />
              <div>
                <h1 className="text-xl font-semibold text-slate-800">
                  Joyzze — Dog Groomer
                </h1>
                <p className="text-xs text-slate-500">
                  {mode === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCredentials} className="mb-4">
              {mode === 'signup' && (
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl px-4 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-xl px-4 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition disabled:opacity-70"
                style={{ backgroundColor: BRAND.charcoal }}
                disabled={loading}
              >
                {loading
                  ? 'Connecting…'
                  : mode === 'login'
                  ? 'Continue with Email'
                  : 'Create Account'}
              </button>
            </form>

            {/* Separator */}
            <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 before:content-[''] after:flex-1 after:border-t after:border-gray-300 after:content-['']">
              <p className="mx-4 text-center text-sm text-gray-500">OR</p>
            </div>

            {/* Google button */}
            <button
              className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition disabled:opacity-70"
              style={{ backgroundColor: '#DB4437' }}
              onClick={handleGoogle}
              disabled={loading}
            >
              {loading
                ? 'Connecting…'
                : mode === 'login'
                ? 'Continue with Google'
                : 'Sign Up with Google'}
            </button>

            {/* Toggle link */}
            <p className="mt-4 text-xs text-slate-500 text-center">
              {mode === 'login' ? (
                <>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-xs text-white mt-auto" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span>Joyzze · Joy of Grooming Made Easy™</span>
          <span>© {new Date().getFullYear()} Joyzze. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
