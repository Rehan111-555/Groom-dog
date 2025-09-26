'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const BRAND = {
  charcoal: '#2f2f31',
};

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
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
    <main className="relative min-h-screen flex flex-col bg-gray-100">
      {/* Background image */}
      <img
        src="/dog-10.png"
        alt="Joyzze background"
        className="absolute inset-0 w-full h-full object-contain opacity-80 -z-10 bg-black"
      />

      {/* Header */}
      <header>
        {/* Top contact bar */}
        <div className="bg-gray-200 px-6 py-2 flex justify-between text-sm">
          <span>(877) 456-9993</span>
          <span>info@joyzze.com</span>
        </div>
        {/* Main nav */}
        <div className="bg-[#323030] text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
            <img src="/dog-5.png" alt="Joyzze" className="h-8" />
            <nav className="flex gap-6 text-sm">
              <a href="#">All Products</a>
              <a href="#">Clippers</a>
              <a href="#">Blades</a>
              <a href="#">Combs & Accessories</a>
              <a href="#">Information</a>
              <a href="#">Recycling & Sharpening</a>
              <a href="#">Distributor</a>
            </nav>
            <div>
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1 rounded text-black"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Auth card */}
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
                  {mode === 'login'
                    ? 'Sign in to continue'
                    : 'Sign up to get started'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCredentials} className="mb-4">
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-xl px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition"
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

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <p className="mx-4 text-sm text-gray-500">OR</p>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition"
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
      <footer className="bg-[#323030] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#">All Products</a></li>
              <li><a href="#">Clippers</a></li>
              <li><a href="#">Blades</a></li>
              <li><a href="#">Combs & Accessories</a></li>
              <li><a href="#">Information</a></li>
              <li><a href="#">Recycling & Sharpening</a></li>
              <li><a href="#">Distributor</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">SERIES</h3>
            <ul className="space-y-2 text-sm">
              <li>A-Series</li>
              <li>C-Series</li>
              <li>D-Series</li>
              <li>M-Series</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">SUBSCRIBE TO OUR NEWSLETTER</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address..."
                className="px-3 py-2 text-black rounded-l-md w-full"
              />
              <button className="bg-teal-500 px-4 py-2 rounded-r-md">→</button>
            </form>
          </div>

          <div>
            <img src="/dog-5.png" alt="Joyzze" className="h-10 mb-4" />
            <p>Joy of Grooming Made Easy™</p>
            <p className="mt-2">(877) 456-9993</p>
            <p><a href="mailto:info@joyzze.com">info@joyzze.com</a></p>
          </div>
        </div>
        <div className="bg-gray-900 py-4 text-center text-xs">
          © {new Date().getFullYear()} Joyzze. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
