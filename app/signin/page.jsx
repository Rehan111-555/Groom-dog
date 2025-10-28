'use client';

import { useEffect, useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/* =============================================================================
   ICONS
   ============================================================================= */
const Icon = {
  Phone: (p: any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  User: (p: any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Bag: (p: any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Sun: (p: any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Moon: (p: any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Menu: (p: any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Close: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  GoogleG: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...p}>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.18-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.25h2.9c1.7-1.57 2.7-3.88 2.7-6.6z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.2l-2.9-2.25c-.8.54-1.82.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H1.9v2.33C3.38 15.98 6 18 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V4.97H1.9A8.96 8.96 0 0 0 0 9c0 1.45.35 2.82 1.9 4.03l2.05-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.33l2.56-2.56C13.47.89 11.43 0 9 0 6 0 3.38 2.02 1.9 4.97l2.05 2.33C4.66 5.16 6.65 3.58 9 3.58z"/>
    </svg>
  ),
};

/* =============================================================================
   SHARED HEADER (Responsive: centered logo + mobile drawer)
   ============================================================================= */
function Drawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    const cur = ref.current;
    if (!cur) return;
    const first = cur.querySelector<HTMLElement>('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    first?.focus();
  }, [open]);

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        ref={ref}
        className={`fixed top-0 right-0 h-full w-[88%] max-w-[360px] bg-[var(--surface)] text-[var(--fg)] shadow-2xl transition-transform duration-300 z-[1002] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="text-sm font-semibold">Menu</div>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-md hover:bg-[var(--muted-bg)]" aria-label="Close menu">
            <Icon.Close />
          </button>
        </div>
        <nav className="p-3 text-[15px]">
          <a className="mob-link" href="https://joyzze.com/all-products/">All Products</a>
          <a className="mob-link" href="https://joyzze.com/clippers/">Clippers</a>
          <a className="mob-link" href="https://joyzze.com/blades/">Blades</a>
          <a className="mob-link" href="https://joyzze.com/combs-accessories/">Combs & Accessories</a>
          <a className="mob-link" href="https://joyzze.com/information/">Information</a>
          <a className="mob-link" href="https://joyzze.com/recycling-sharpening/">Recycling & Sharpening</a>
          <a className="mob-link" href="https://joyzze.com/distributor/">Distributor</a>
        </nav>
      </aside>
    </>
  );
}

function SiteHeader() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('joyzze-theme') as 'light' | 'dark' | null) : null;
    const initial = saved || 'light';
    setTheme(initial);
    document.documentElement.classList.toggle('theme-dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('joyzze-theme', next);
    document.documentElement.classList.toggle('theme-dark', next === 'dark');
  };

  return (
    <>
      <div className="sticky top-0 z-[1001] bg-[var(--header-bg)] text-[var(--header-fg)] border-b border-[var(--border)]">
        {/* Three-column sticky bar — keeps logo perfectly centered */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-4 h-[64px]">
          {/* Left: phone */}
          <a href="tel:(877) 456-9993" className="justify-self-start flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold">
            <Icon.Phone className="opacity-85" />
            <span className="tracking-[.01em]">(877) 456-9993</span>
          </a>

          {/* Center: logo */}
          <a
            href="/"
            className="justify-self-center block rounded-[10px] overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,.35)]"
            aria-label="Joyzze"
          >
            <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] px-6 py-2 rounded-[10px]">
              <img
                src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
                alt="Joyzze"
                className="h-[40px] w-auto align-middle"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).outerHTML =
                    '<span class="text-white text-[24px] font-semibold tracking-[0.25em] px-3">JOYZZE</span>';
                }}
              />
            </div>
          </a>

          {/* Right: theme + icons + hamburger (mobile) */}
          <div className="justify-self-end flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleTheme}
              className="h-9 px-2 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted-bg)] inline-flex items-center gap-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Icon.Moon /> : <Icon.Sun />}
              <span className="hidden sm:inline text-[13px]">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

            <a className="hidden md:grid place-items-center w-9 h-9 rounded-md hover:bg-[var(--muted-bg)]" href="/account.php" aria-label="Account">
              <Icon.User />
            </a>
            <a className="hidden md:grid place-items-center w-9 h-9 rounded-md hover:bg-[var(--muted-bg)]" href="/cart.php" aria-label="Cart">
              <Icon.Bag />
            </a>

            <button
              className="grid md:hidden place-items-center w-9 h-9 rounded-md hover:bg-[var(--muted-bg)]"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Icon.Menu />
            </button>
          </div>
        </div>

        {/* Desktop navbar */}
        <nav className="hidden md:block bg-[var(--nav-bg)] text-[var(--nav-fg)] border-t border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto px-2 lg:px-4">
            <div className="flex flex-wrap">
              {[
                ['All Products','https://joyzze.com/all-products/'],
                ['Clippers','https://joyzze.com/clippers/'],
                ['Blades','https://joyzze.com/blades/'],
                ['Combs & Accessories','https://joyzze.com/combs-accessories/'],
                ['Information','https://joyzze.com/information/'],
                ['Recycling & Sharpening','https://joyzze.com/recycling-sharpening/'],
                ['Distributor','https://joyzze.com/distributor/'],
              ].map(([label,href])=>(
                <a key={label} href={href} className="px-4 py-3 text-[14px] font-semibold tracking-[.01em] hover:text-[var(--joyzze-teal)]">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}

/* =============================================================================
   FOOTER
   ============================================================================= */
function Footer() {
  return (
    <footer className="bg-[#4a4a4a] text-slate-100 mt-16">
      <div className="bg-[#0a0a0a] border-b-2 border-[var(--joyzze-teal)]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[14px]">
          <div className="flex items-center gap-2"><span className="text-[var(--joyzze-teal)]">🚚</span> Free Shipping on orders over $350</div>
          <div className="flex items-center gap-2"><span className="text-[var(--joyzze-teal)]">↩</span> Hassle Free Returns</div>
          <div className="flex items-center gap-2"><span className="text-[var(--joyzze-teal)]">💳</span> All Major Cards Accepted</div>
          <div className="flex items-center gap-2"><span className="text-[var(--joyzze-teal)]">🔒</span> 100% Safe & Secure Checkout</div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 grid gap-10 md:grid-cols-3">
        <div>
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">LINKS</h4>
          <ul className="space-y-2 text-[15px]">
            <li><a className="hover:underline" href="https://joyzze.com/all-products/">All Products</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/clippers/">Clippers</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/blades/">Blades</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/combs-accessories/">Combs & Accessories</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/information/">Information</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/recycling-sharpening/">Recycling & Sharpening</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/distributor/">Distributor</a></li>
            <li><a className="hover:underline" href="https://joyzze.com/sitemap.php">View All</a></li>
          </ul>
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] rounded-lg px-7 py-3 shadow">
            <img
              src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
              alt="Joyzze"
              className="h-9 w-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).outerHTML =
                  '<span class="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>';
              }}
            />
          </div>
          <p className="mt-3 text-sm text-white/80">Joy of Grooming Made Easy™</p>
          <div className="mt-6 space-y-1 text-[15px]">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com" className="hover:underline">info@joyzze.com</a></div>
          </div>
        </div>

        <div className="md:justify-self-end">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="flex items-stretch w-full max-w-[360px]" onSubmit={(e)=>e.preventDefault()}>
            <input type="email" placeholder="Email address..." className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none"/>
            <button type="submit" className="px-4 rounded-r-md bg-[var(--joyzze-teal)] text-black text-sm font-semibold">✉</button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-10">
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-white/80">© {new Date().getFullYear()} Joyzze. All rights reserved. | Sitemap</div>
          <div className="flex items-center gap-6 text-[15px]">
            <span className="text-[var(--joyzze-teal)] font-semibold">SERIES</span>
            <a href="https://joyzze.com/a-series/" className="hover:underline">A-SERIES</a>
            <a href="https://joyzze.com/c-series/" className="hover:underline">C-SERIES</a>
            <a href="https://joyzze.com/d-series/" className="hover:underline">D-SERIES</a>
            <a href="https://joyzze.com/m-series/" className="hover:underline">M-SERIES</a>
            <a href="https://joyzze.com/all-products/" className="hover:underline">View All</a>
          </div>
        </div>
      </div>

      <div className="bg-black/80 text-white text-xs px-4 py-2">Manage Website Data Collection Preferences</div>
    </footer>
  );
}

/* =============================================================================
   AUTH PAGE
   ============================================================================= */
const BRAND = { teal: '#1CD2C1' };

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login'|'signup'>('login');
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

  async function handleCredentials(e: React.FormEvent) {
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
      const result = await signIn('credentials', { redirect: false, email, password });
      if ((result as any)?.error) {
        alert('Authentication failed. Please check your credentials.');
      } else {
        router.push((result as any)?.url || '/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--page-fg)]">
      <SiteHeader />

      <section className="flex-1">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: form */}
          <section className="px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 pt-10 md:pt-14 pb-16">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#f1f1ff] shadow mb-6">
                <img src="/dog-5.png" alt="logo" className="w-6 h-6 object-contain" />
              </div>

              <h1 className="text-[30px] md:text-[36px] lg:text-[40px] font-semibold tracking-[.015em] mb-2">Welcome back!</h1>
              <p className="text-[14px] md:text-[15px] text-[var(--muted-fg)] mb-8">
                Enter to get unlimited access to data &amp; information.
              </p>

              <form onSubmit={handleCredentials} className="mb-4">
                {mode === 'signup' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name <span className="text-[#6b6bff]">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="jz-field w-full h-[48px] rounded-[10px] px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-[#6b6bff] outline-none"
                      required
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email <span className="text-[#6b6bff]">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="jz-field w-full h-[48px] rounded-[10px] px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-[#6b6bff] outline-none"
                    placeholder="Enter your mail address"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Password <span className="text-[#6b6bff]">*</span></label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="jz-field w-full h-[48px] rounded-[10px] px-4 pr-10 ring-1 ring-gray-300 focus:ring-2 focus:ring-[#6b6bff] outline-none"
                      placeholder="Enter password"
                      required
                    />
                    <svg width="18" height="18" viewBox="0 0 24 24" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mt-2 gap-3">
                    <label className="inline-flex items-center gap-2 text-[13px]">
                      <input type="checkbox" className="accent-[var(--joyzze-teal)]" defaultChecked />
                      Remember me
                    </label>
                    <a href="#" className="text-[13px] text-[#6b6bff] hover:underline">Forgot your password ?</a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-[10px] text-white font-medium shadow-md hover:shadow-lg transition"
                  style={{ backgroundColor: BRAND.teal }}
                  disabled={loading}
                >
                  {loading ? 'Connecting…' : mode === 'login' ? 'Log In' : 'Create Account'}
                </button>
              </form>

              <div className="my-4 flex items-center">
                <div className="flex-1 border-t border-gray-300" />
                <p className="mx-4 text-sm text-gray-500">Or, Login with</p>
                <div className="flex-1 border-t border-gray-300" />
              </div>

              <button
                className="google-btn w-full h-12 rounded-[10px] font-medium shadow-sm hover:shadow-md transition flex items-center justify-center gap-3"
                onClick={handleGoogle}
                disabled={loading}
                aria-label="Continue with Google"
              >
                <Icon.GoogleG />
                <span>{loading ? 'Connecting…' : 'Sign in with Google'}</span>
              </button>

              <p className="mt-4 text-xs text-[var(--muted-fg)]">
                {mode === 'login' ? (
                  <>
                    Don’t have an account?{' '}
                    <button type="button" onClick={() => setMode('signup')} className="text-[#6b6bff] hover:underline">Register here</button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-[#6b6bff] hover:underline">Sign in</button>
                  </>
                )}
              </p>
            </div>
          </section>

          {/* RIGHT: hero image */}
          <section className="relative hidden lg:block">
            <div className="auth-hero">
              <img src="/dog-7.png" alt="hero dogs" className="w-full h-full object-cover" />
            </div>
          </section>
        </div>
      </section>

      <Footer />

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

        :root{
          --joyzze-teal:#1CD2C1;
          --page-bg:#f6f8fb;
          --page-fg:#0e0f11;
          --muted-fg:#6b7280;
          --header-bg:#e9eff5;
          --header-fg:#0e0f11;
          --nav-bg:#2f2f2f;
          --nav-fg:#d7d7d7;
          --surface:#ffffff;
          --fg:#0e0f11;
          --muted-bg:#f1f5f9;
          --border: rgba(15, 23, 42, .12);
        }
        html.theme-dark{
          --page-bg:#0f1115;
          --page-fg:#f4f7fb;
          --muted-fg:#a3a9b6;
          --header-bg:#151922;
          --header-fg:#f4f7fb;
          --nav-bg:#111318;
          --nav-fg:#d7d7d7;
          --surface:#161a22;
          --fg:#f4f7fb;
          --muted-bg:#11151c;
          --border: rgba(255,255,255,.14);
        }
        html,body{ font-family:'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }

        /* Inputs (theme aware) */
        .jz-field{
          background:var(--surface) !important;
          color:var(--fg) !important;
          border-color:var(--border);
        }
        .google-btn{ background:#fff; color:#3c4043; border:1px solid #dadce0; }
        .google-btn:disabled{ opacity:.7; cursor:not-allowed; }

        .auth-hero{ position:relative; width:100%; height:100%; min-height:640px; background:#000; }

        .mob-link{ display:block; padding:.75rem .75rem; border-radius:.5rem; border:1px solid var(--border); background:var(--surface); margin-bottom:.5rem; }
        .mob-link:hover{ background:var(--muted-bg); }

        /* small polish for links */
        nav a { text-decoration:none; }

        /* ensure page content can't slide under sticky header */
        .sticky + * { position: relative; z-index: 1; }
      `}</style>
    </main>
  );
}
