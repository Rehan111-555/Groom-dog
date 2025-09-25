'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

// Brand colors (single source of truth)
const BRAND = {
  charcoal: '#2f2f31', // header, footer, and button
};

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('from') || '/';
      await signIn('google', { callbackUrl: to }); // first-time users are created automatically
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_700px_at_10%_-10%,#ffffff_0%,#f6f7fb_45%,#eef2f9_100%)]">
      {/* Top bar */}
      <header className="w-full text-xs text-white" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Small logo from /public */}
            <img src="/dog-5.png" width={24} height={24} alt="Joyzze" className="rounded" />
            <span>Joyzze — Dog Groomer</span>
          </div>
          <a href="https://joyzze.com" className="opacity-80 hover:opacity-100">joyzze.com</a>
        </div>
      </header>

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

            {/* Google button (same color as header/footer) */}
            <button
              className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition disabled:opacity-70"
              style={{ backgroundColor: BRAND.charcoal }}
              onClick={handleGoogle}
              disabled={loading}
            >
              {loading ? 'Connecting…' : 'Continue with Google'}
            </button>

            {/* Helper text (remove if you don’t want it) */}
            <p className="mt-4 text-xs text-slate-500">
              First-time users are created automatically after Google confirms your account.
            </p>

            {/* ✅ Feature cards removed as requested */}
          </section>

          {/* Right: hero image (from /public). Delete this section if you don’t want the image panel. */}
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[340px] hidden md:block">
            <img
              src="/dog-1.jpg"
              alt="Grooming hero"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = '/dog-5.png'; }}
            />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-xs text-white" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span>Joyzze · Joy of Grooming Made Easy™</span>
          <span>© {new Date().getFullYear()} Joyzze. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
