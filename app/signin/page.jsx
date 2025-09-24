'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const JOYZZE = {
  teal: '#24c9bb',       // main accent
  tealDark: '#16a899',   // darker hover
  charcoal: '#3d3d3f',   // header/footer bg
  graphite: '#4b4b4d',   // deeper shadowy gray
};

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
    <div className="min-h-screen bg-[#f3f6f8] flex flex-col">
      {/* Top bar (charcoal) */}
      <header
        className="w-full"
        style={{ backgroundColor: JOYZZE.charcoal }}
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between text-white/90">
          <div className="flex items-center gap-3">
            <img
              src="/dog-5.png"
              alt="Joyzze mark"
              className="w-7 h-7 rounded-xl bg-white object-cover ring-1 ring-white/20"
            />
            <div className="text-sm md:text-base">
              <span className="font-semibold">Joyzze</span>
              <span className="mx-2">—</span>
              <span>Dog Groomer</span>
            </div>
          </div>
          <Link
            href="https://joyzze.com"
            target="_blank"
            className="text-xs md:text-sm underline decoration-white/30 hover:decoration-white"
            prefetch={false}
          >
            joyzze.com
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-10 grow">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Card with CTA */}
          <div className="rounded-3xl bg-white border border-black/5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/dog-5.png"
                  alt="Joyzze"
                  className="w-9 h-9 rounded-2xl bg-white object-cover ring-1 ring-black/10"
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold">
                    Joyzze — Dog Groomer
                  </h1>
                  <p className="text-xs text-slate-600">
                    Sign in / Sign up to continue
                  </p>
                </div>
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 text-white font-medium shadow hover:shadow-md transition
                           ring-1 ring-black/5 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(180deg, ${JOYZZE.teal} 0%, ${JOYZZE.tealDark} 100%)`,
                }}
              >
                {loading ? 'Connecting…' : 'Continue with Google'}
              </button>

              <p className="mt-3 text-xs text-slate-500">
                First-time users are created automatically after Google confirms your account.
              </p>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Badge title="Professional" subtitle="Approved" />
                <Badge title="1-Year" subtitle="Defect Guarantee" />
                <Badge title="Flat-Rate" subtitle="Shipping" />
              </div>

              {/* Small image tiles */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Tile src="/dog-1.jpg" alt="Sample dog" />
                <Tile src="/dog-2.jpg" alt="Sample dog" />
                <Tile src="/dog-3.jpg" alt="Sample dog" />
                <Tile src="/dog-4.jpg" alt="Sample dog" />
              </div>
            </div>
          </div>

          {/* Right: Hero panel with gradient & image */}
          <div className="rounded-3xl overflow-hidden border border-black/5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-white relative">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(36,201,187,0.08) 0%, rgba(36,201,187,0.00) 65%)',
              }}
            />
            <img
              src="/dog-4.jpg"
              alt="Grooming hero"
              className="w-full h-full object-cover mix-blend-normal"
            />
          </div>
        </div>
      </main>

      {/* Footer (charcoal) */}
      <footer
        className="w-full text-white/85"
        style={{ backgroundColor: JOYZZE.charcoal }}
      >
        <div className="container mx-auto px-6 py-4 text-xs flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Joyzze</span>
            <span className="opacity-60">·</span>
            <span>Joy of Grooming Made Easy™</span>
          </div>
          <div className="opacity-80">© {new Date().getFullYear()} Joyzze. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- small components ---------- */

function Badge({ title, subtitle }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3 text-center">
      <div className="text-[11px] uppercase tracking-wide font-semibold"
           style={{ color: JOYZZE.teal }}>
        {title}
      </div>
      <div className="text-[11px] text-slate-600">{subtitle}</div>
    </div>
  );
}

function Tile({ src, alt }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-black/5 bg-slate-50 h-28">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
