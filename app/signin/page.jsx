'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/** Brand palette */
const BRAND = {
  teal: '#24c9bb',       // primary button
  tealDark: '#16a899',   // hover
  charcoal: '#3d3d3f',   // header/footer + all outlines you asked to match
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
      {/* Top bar */}
      <header className="w-full" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="container mx-auto px-6 py-3 flex items-center justify-between text-white/90">
          <div className="flex items-center gap-3">
            <img
              src="/dog-5.png"
              alt="Joyzze mark"
              className="w-7 h-7 rounded-xl bg-white object-cover"
              /* ring color switched to charcoal */
              style={{ boxShadow: '0 0 0 1px rgba(61,61,63,.4)' }}
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

      {/* Main */}
      <main className="container mx-auto px-6 py-10 grow">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left card */}
          <div
            className="rounded-3xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            /* card border switched to charcoal */
            style={{ border: '1px solid rgba(61,61,63,.18)' }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/dog-5.png"
                  alt="Joyzze"
                  className="w-9 h-9 rounded-2xl bg-white object-cover"
                  /* little logo ring switched to charcoal */
                  style={{ boxShadow: '0 0 0 1px rgba(61,61,63,.35)' }}
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

              {/* Primary button stays teal */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 text-white font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: BRAND.teal,
                  boxShadow: '0 10px 22px rgba(36,201,187,.28)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND.tealDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND.teal)
                }
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(36,201,187,.9), 0 10px 22px rgba(36,201,187,.28)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 10px 22px rgba(36,201,187,.28)')
                }
              >
                {loading ? 'Connecting…' : 'Continue with Google'}
              </button>

              <p className="mt-3 text-xs text-slate-500">
                First-time users are created automatically after Google confirms your account.
              </p>

              {/* Badges now use CHARCOAL for title + border */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Badge title="PROFESSIONAL" subtitle="Approved" />
                <Badge title="1-YEAR" subtitle="Defect Guarantee" />
                <Badge title="FLAT-RATE" subtitle="Shipping" />
              </div>

              {/* Image tiles (borders switched to charcoal) */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Tile src="/dog-1.jpg" alt="Sample dog" />
                <Tile src="/dog-2.jpg" alt="Sample dog" />
                <Tile src="/dog-3.jpg" alt="Sample dog" />
                <Tile src="/dog-4.jpg" alt="Sample dog" />
              </div>
            </div>
          </div>

          {/* Right hero (border switched to charcoal) */}
          <div
            className="rounded-3xl overflow-hidden bg-white relative shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            style={{ border: '1px solid rgba(61,61,63,.18)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(61,61,63,.06) 0%, rgba(61,61,63,0) 65%)',
              }}
            />
            <img src="/dog-4.jpg" alt="Grooming hero" className="w-full h-full object-cover" />
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
          <div className="opacity-80">© {new Date().getFullYear()} Joyzze. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Components now using CHARCOAL instead of teal ---------- */

function Badge({ title, subtitle }) {
  return (
    <div
      className="rounded-xl bg-white p-3 text-center"
      /* border color set to charcoal */
      style={{ border: '1px solid rgba(61,61,63,.28)' }}
    >
      <div
        className="text-[11px] uppercase tracking-wide font-semibold"
        /* title text color set to charcoal */
        style={{ color: BRAND.charcoal }}
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
      className="rounded-2xl overflow-hidden bg-white h-28 transition-shadow"
      /* border color set to charcoal */
      style={{ border: '1px solid rgba(61,61,63,.18)' }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(61,61,63,.45)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      />
    </div>
  );
}
