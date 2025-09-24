'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

// Ensure SSR doesn't try to prerender any session state here
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#f3f6fb]">
      {/* Top bar */}
      <div className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/dog-5.png"
              alt="Joyzze mark"
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/5"
            />
            <span className="text-lg font-semibold tracking-tight">Joyzze — Dog Groomer</span>
          </div>
          <a
            href="https://joyzze.com"
            target="_blank"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            joyzze.com
          </a>
        </div>
      </div>

      {/* Hero section */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: brand card */}
          <div className="card overflow-hidden p-0">
            {/* brand header */}
            <div className="p-6 border-b border-black/5 bg-white">
              <div className="flex items-center gap-3">
                <img
                  src="/dog-5.png"
                  alt="Joyzze"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5"
                />
                <div>
                  <h1 className="text-2xl font-semibold leading-tight">Joyzze — Dog Groomer</h1>
                  <p className="text-sm text-slate-600">Sign in / Sign up to continue</p>
                </div>
              </div>
            </div>

            {/* body */}
            <div className="p-6">
              {/* Google CTA */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition shadow ring-1 ring-indigo-600/20 disabled:opacity-70"
              >
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden="true">
                  <path fill="#fff" d="M0 0h533.5v544.3H0z" opacity="0" />
                  <path fill="#4285f4" d="M533.5 278.4c0-18.9-1.7-37-4.9-54.6H272.1v103.5h146.9c-6.3 34-25 62.9-53.3 82.3l86.1 66.7c50.1-46.2 81.7-114.3 81.7-198z" />
                  <path fill="#34a853" d="M272.1 544.3c71.6 0 131.8-23.7 175.8-64.4l-86.1-66.7c-23.9 16.1-54.5 25.7-89.7 25.7-68.9 0-127.2-46.5-148-109.1H36.1v68.6C79.7 484.4 170.7 544.3 272.1 544.3z" />
                  <path fill="#fbbc05" d="M124.1 329.8c-10.3-30.9-10.3-64.2 0-95.1V166.1H36.1c-39.1 78.2-39.1 171.8 0 250.1l88-86.4z" />
                  <path fill="#ea4335" d="M272.1 106.2c37.9-.6 74.2 13.6 101.8 39.8l76.2-76.2C397.7 24.9 338 0 272.1 0 170.7 0 79.7 59.9 36.1 166.1l88 68.6c20.8-62.7 79.1-109.1 148-109.1z" />
                </svg>
                <span className="font-medium">
                  {loading ? 'Connecting…' : 'Continue with Google'}
                </span>
              </button>

              {/* fine print */}
              <p className="mt-3 text-xs text-slate-500">
                First-time users are created automatically after Google confirms your account.
              </p>

              {/* trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-black/5 bg-white p-4 text-center">
                  <div className="text-sm font-semibold">Professional</div>
                  <div className="text-xs text-slate-500">Approved</div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white p-4 text-center">
                  <div className="text-sm font-semibold">1-Year</div>
                  <div className="text-xs text-slate-500">Defect Guarantee</div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white p-4 text-center">
                  <div className="text-sm font-semibold">Flat-Rate</div>
                  <div className="text-xs text-slate-500">Shipping</div>
                </div>
              </div>

              {/* small feature tiles */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden ring-1 ring-black/5">
                  <img src="/dog-1.jpg" alt="Sample dog" className="w-full h-32 object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden ring-1 ring-black/5">
                  <img src="/dog-2.jpg" alt="Sample dog" className="w-full h-32 object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
            <img
              src="/dog-2.jpg"
              alt="Grooming hero"
              className="w-full h-full object-cover min-h-[420px]"
            />
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-black/5 bg-white/70 backdrop-blur">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <span className="font-semibold">Joyzze</span>
            <span>·</span>
            <span>Joy of Grooming Made Easy™</span>
          </div>
          <div className="text-xs text-slate-500">© {new Date().getFullYear()} Joyzze. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
