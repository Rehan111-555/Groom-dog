'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const BRAND = {
  teal: '#24c9bb',
  tealDark: '#16a899',
  charcoal: '#3d3d3f',
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
    <div
      className="min-h-screen bg-[#f3f6f8] flex flex-col"
      style={{ ['--brand' as any]: BRAND.teal } as React.CSSProperties}
    >
      {/* Top bar */}
      <header className="w-full" style={{ backgroundColor: BRAND.charcoal }}>
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
            className="text-xs md:text-sm underline decoration-white/30 hover:decoration-[color:var(--brand)]"
            prefetch={false}
          >
            joyzze.com
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-10 grow">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Card */}
          <div className="rounded-3xl bg-white border border-black/5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/dog-5.png"
                  alt="Joyzze"
                  className="w-9 h-9 rounded-2xl bg-white object-cover ring-1 ring-[color:var(--brand)]/30"
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

              {/* Brand teal button */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 text-white font-medium shadow transition
                           ring-2 focus:outline-none focus-visible:ring-4 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(180deg, ${BRAND.teal} 0%, ${BRAND.tealDark} 100%)`,
                  boxShadow:
                    '0 8px 18px rgba(36, 201, 187, 0.25)',
                  borderColor: 'var(--brand)',
                }}
              >
                {loading ? 'Connecting…' : 'Continue with Google'}
              </button>

              <p className="mt-3 text-xs text-slate-500">
                First-time users are created automatically after Google confirms your account.
              </p>

              {/* Badges (teal everywhere) */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Badge title="Professional" subtitle="Approved" />
                <Badge title="1-Year" subtitle="Defect Guarantee" />
                <Badge title="Flat-Rate" subtitle="Shipping" />
              </div>

              {/* Image tiles */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Tile src="/dog-1.jpg" alt="Sample dog" />
                <Tile src="/dog-2.jpg" alt="Sample dog" />
                <Tile src="/dog-3.jpg" alt="Sample dog" />
                <Tile src="/dog-4.jpg" alt="Sample dog" />
              </div>
            </div>
          </div>

          {/* Right hero */}
          <div className="rounded-3xl overflow-hidden border border-[color:var(--brand)]/20 shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-white relative">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(36,201,187,0.10) 0%, rgba(36,201,187,0.00) 65%)',
              }}
            />
            <img
              src="/dog-4.jpg"
              alt="Grooming hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-white/85" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="container mx-auto px-6 py-4 text-xs flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Joyzze</span>
            <span className="opacity-60">·</span>
            <span>Joy of Grooming Made Easy™</span>
          </div>
          <div className="opacity-80">
            © {new Date().getFullYear()} Joyzze. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --------- pieces that reuse --brand --------- */

function Badge({ title, subtitle }) {
  return (
    <div
      className="rounded-xl bg-white p-3 text-center border"
      style={{ borderColor: 'color-mix(in oklab, var(--brand) 25%, black 90%)' }}
    >
      <div
        className="text-[11px] uppercase tracking-wide font-semibold"
        style={{ color: 'var(--brand)' }}
      >
        {title}
      </div>
      <div className="text-[11px] text-slate-600">{subtitle}</div>
    </div>
  );
}

function Tile({ src, alt }) {
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white h-28 border transition-shadow"
      style={{ borderColor: 'color-mix(in oklab, var(--brand) 20%, white 85%)' }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover hover:shadow-[0_0_0_3px_var(--brand)] transition-shadow"
      />
    </div>
  );
}
