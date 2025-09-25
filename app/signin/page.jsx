'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Brand color for header/footer + button
const BRAND = {
  charcoal: '#2f2f31',
};

// Sample pictures (make sure these are in /public)
const SAMPLES = ['/dog-6.png', '/dog-8.png', '/dog-9.png', '/dog-10.png'];
const FALLBACK = '/dog-5.png';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
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
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      alert('Sign-in failed. Please check your credentials.');
    } else {
      router.push(result.url || '/');
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(1200px_700px_at_10%_-10%,#ffffff_0%,#f6f7fb_45%,#eef2f9_100%)]">
      {/* Top bar */}
      <header className="w-full text-xs text-white" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/dog-5.png" width={24} height={24} alt="Joyzze" className="rounded" />
            <span>Joyzze — Dog Groomer</span>
          </div>
          <a href="https://joyzze.com" className="opacity-80 hover:opacity-100">joyzze.com</a>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Sign-in card */}
            <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/dog-5.png"
                  alt="Joyzze logo"
                  className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5"
                />
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">Joyzze — Dog Groomer</h1>
                  <p className="text-xs text-slate-500">Sign in / Sign up to continue</p>
                </div>
              </div>

              {/* Email and Password Form */}
              <form onSubmit={handleCredentials} className="mb-4">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                  {loading ? 'Connecting…' : 'Continue with Email'}
                </button>
              </form>

              {/* Separator */}
              <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 before:content-[''] after:flex-1 after:border-t after:border-gray-300 after:content-['']">
                <p className="mx-4 text-center text-sm text-gray-500">OR</p>
              </div>

              {/* Google Sign-in Button */}
              <button
                className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition disabled:opacity-70"
                style={{ backgroundColor: '#DB4437' }}
                onClick={handleGoogle}
                disabled={loading}
              >
                {loading ? 'Connecting…' : 'Continue with Google'}
              </button>

              <p className="mt-4 text-xs text-slate-500">
                First-time users are created automatically after Google confirms your account.
              </p>

              {/* 2×2 sample images */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {SAMPLES.map((src, i) => (
                  <div key={i} className="rounded-xl overflow-hidden ring-1 ring-black/5 bg-slate-50">
                    <img
                      src={src}
                      alt={`Sample dog ${i + 1}`}
                      className="w-full h-36 md:h-40 object-cover"
                      onError={(e) => { e.currentTarget.src = FALLBACK; }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Right: hero image */}
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[340px] hidden md:block">
              <img
                src="/dog-7.png"
                alt="Grooming hero"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = FALLBACK; }}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Footer pinned to bottom */}
      <footer
        className="w-full text-xs text-white mt-auto"
        style={{ backgroundColor: BRAND.charcoal }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span>Joyzze · Joy of Grooming Made Easy™</span>
          <span>© {new Date().getFullYear()} Joyzze. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
