'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/* =================================
   Icons (tiny, dependency-free)
   ================================= */
const Icon = {
  Phone: (p:any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/>
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  User: (p:any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Bag: (p:any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Sun: (p:any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Moon: (p:any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Menu: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Close: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  GoogleG: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...p}>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.18-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.25h2.9c1.7-1.57 2.7-3.88 2.7-6.6z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.2l-2.9-2.25c-.8.54-1.82.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H1.9v2.33C3.38 15.98 6 18 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V4.97H1.9A8.96 8.96 0 0 0 0 9c0 1.45.35 2.82 1.9 4.03l2.05-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.33l2.56-2.56C13.47.89 11.43 0 9 0 6 0 3.38 2.02 1.9 4.97l2.05 2.33C4.66 5.16 6.65 3.58 9 3.58z"/>
    </svg>
  ),
  Truck: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 6h10v8H3zM13 10h4l4 4v4h-4M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Return: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M20 18a8 8 0 1 0-3.1-15.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  Card: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Lock: (p:any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
};

/* =================================
   Responsive Header (shared feel)
   ================================= */
function Header() {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('joyzze-theme') : null;
    const initial = saved === 'dark' ? 'dark' : 'light';
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
    <header className="sticky top-0 z-50 bg-[var(--header-top-bg)] text-[var(--header-top-fg)]">
      {/* top row */}
      <div className="mx-auto max-w-[1280px] px-3 sm:px-4">
        <div className="h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4">
          {/* left: phone */}
          <a href="tel:(877)456-9993" className="hidden xs:flex items-center gap-2 text-sm font-semibold">
            <Icon.Phone className="opacity-85" />
            <span>(877) 456-9993</span>
          </a>

          {/* center: logo always centered */}
          <div className="justify-self-center">
            <a
              href="/"
              className="block rounded-lg overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,.35)]"
              aria-label="Joyzze"
            >
              <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] px-5 py-2 rounded-lg">
                <img
                  src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
                  alt="Joyzze"
                  className="h-10 w-auto"
                  onError={(e:any)=>{e.currentTarget.outerHTML='<span class="text-white text-xl font-semibold tracking-[0.25em] px-2">JOYZZE</span>'}}
                />
              </div>
            </a>
          </div>

          {/* right: actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-black/10 bg-white/70 hover:bg-white/90 backdrop-blur text-[13px]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Icon.Moon /> : <Icon.Sun />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

            {/* mobile menu button (turns on slide-over) */}
            <button
              className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Icon.Menu />
            </button>

            {/* desktop quick icons */}
            <div className="hidden lg:flex items-center gap-2">
              <a className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" href="/account.php" aria-label="Account">
                <Icon.User />
              </a>
              <a className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" href="/cart.php" aria-label="Cart">
                <Icon.Bag />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* desktop nav */}
      <nav className="hidden lg:block bg-[#2f2f2f] text-[#d7d7d7] border-t border-black/10">
        <div className="mx-auto max-w-[1280px] px-2">
          <div className="flex flex-wrap items-center gap-2 py-2">
            {[
              ['All Products','https://joyzze.com/all-products/'],
              ['Clippers','https://joyzze.com/clippers/'],
              ['Blades','https://joyzze.com/blades/'],
              ['Combs & Accessories','https://joyzze.com/combs-accessories/'],
              ['Information','https://joyzze.com/information/'],
              ['Recycling & Sharpening','https://joyzze.com/recycling-sharpening/'],
              ['Distributor','https://joyzze.com/distributor/'],
            ].map(([label,href])=>(
              <a key={label} href={href} className="jz-item inline-flex items-center gap-1 rounded-md px-3 py-2 hover:text-[#00e1c9] hover:bg-white/5">
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* mobile slide-over nav */}
      {open && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <aside className="fixed right-0 top-0 h-full w-[84vw] max-w-[380px] bg-[#1b1d22] text-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold opacity-80">Menu</span>
              <button className="w-9 h-9 grid place-items-center rounded-md hover:bg-white/10" onClick={()=>setOpen(false)} aria-label="Close menu">
                <Icon.Close />
              </button>
            </div>
            <div className="space-y-2">
              {[
                ['All Products','https://joyzze.com/all-products/'],
                ['Clippers','https://joyzze.com/clippers/'],
                ['Blades','https://joyzze.com/blades/'],
                ['Combs & Accessories','https://joyzze.com/combs-accessories/'],
                ['Information','https://joyzze.com/information/'],
                ['Recycling & Sharpening','https://joyzze.com/recycling-sharpening/'],
                ['Distributor','https://joyzze.com/distributor/'],
                ['Account','/account.php'],
                ['Cart','/cart.php'],
              ].map(([label,href])=>(
                <a key={label} href={href} className="block rounded-md px-3 py-2 bg-white/5 hover:bg-white/10">{label}</a>
              ))}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

/* =================================
   Footer (responsive)
   ================================= */
function FooterPromoRibbon() {
  return (
    <div className="bg-[#0e0e0e] text-[#d9d9d9] border-t-2 border-[var(--joyzze-teal)]">
      <div className="max-w-[1280px] mx-auto px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[13px]">
        <div className="flex items-center gap-3"><Icon.Truck className="text-[var(--joyzze-teal)]"/><span>Free Shipping on orders over $350</span></div>
        <div className="flex items-center gap-3"><Icon.Return className="text-[var(--joyzze-teal)]"/><span>Hassle Free Returns</span></div>
        <div className="flex items-center gap-3"><Icon.Card className="text-[var(--joyzze-teal)]"/><span>All Major Cards Accepted</span></div>
        <div className="flex items-center gap-3"><Icon.Lock className="text-[var(--joyzze-teal)]"/><span>100% Safe &amp; Secure Checkout</span></div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#4a4a4a] text-slate-100 mt-10">
      <FooterPromoRibbon />
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-3">LINKS</h4>
          <ul className="space-y-2 text-[15px] text-slate-200/90">
            <li><a href="https://joyzze.com/all-products/" className="hover:underline">All Products</a></li>
            <li><a href="https://joyzze.com/clippers/" className="hover:underline">Clippers</a></li>
            <li><a href="https://joyzze.com/blades/" className="hover:underline">Blades</a></li>
            <li><a href="https://joyzze.com/combs-accessories/" className="hover:underline">Combs &amp; Accessories</a></li>
            <li><a href="https://joyzze.com/information/" className="hover:underline">Information</a></li>
            <li><a href="https://joyzze.com/recycling-sharpening/" className="hover:underline">Recycling &amp; Sharpening</a></li>
            <li><a href="https://joyzze.com/distributor/" className="hover:underline">Distributor</a></li>
            <li><a href="https://joyzze.com/sitemap.php" className="hover:underline">View All</a></li>
          </ul>
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] rounded-lg px-7 py-3 shadow">
            <img
              src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
              alt="Joyzze" className="h-9 w-auto"
              onError={(e:any)=>{e.currentTarget.outerHTML='<span class="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>'}}
            />
          </div>
          <p className="mt-3 text-sm text-white/80">Joy of Grooming Made Easy™</p>
          <div className="mt-6 space-y-1 text-[15px] text-slate-100">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com" className="hover:underline">info@joyzze.com</a></div>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-3">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="flex items-stretch w-full max-w-[360px]" onSubmit={(e)=>e.preventDefault()}>
            <input type="email" placeholder="Email address…" className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none"/>
            <button type="submit" className="px-4 rounded-r-md bg-[var(--joyzze-teal)] text-black text-sm font-semibold">✉</button>
          </form>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 pb-10">
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-white/80">© {new Date().getFullYear()} Joyzze. All rights reserved. | Sitemap</div>
          <div className="flex flex-wrap items-center gap-4 text-[15px]">
            <span className="text-[var(--joyzze-teal)] font-semibold">SERIES</span>
            <a href="https://joyzze.com/a-series/" className="hover:underline">A-SERIES</a>
            <a href="https://joyzze.com/c-series/" className="hover:underline">C-SERIES</a>
            <a href="https://joyzze.com/d-series/" className="hover:underline">D-SERIES</a>
            <a href="https://joyzze.com/m-series/" className="hover:underline">M-SERIES</a>
            <a href="https://joyzze.com/all-products/" className="hover:underline">View All</a>
          </div>
        </div>
      </div>
      <div className="bg-black/80 text-white text-xs px-4 py-2 text-center">Manage Website Data Collection Preferences</div>
    </footer>
  );
}

/* =================================
   Page (login)
   ================================= */
const BRAND = { teal: '#1CD2C1' };

export default function Page() {
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

  async function handleCredentials(e:any) {
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
      if (result?.error) {
        alert('Authentication failed. Please check your credentials.');
      } else {
        router.push(result?.url || '/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--page-fg)]">
      <Header />

      {/* body */}
      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2">
          {/* form */}
          <section className="px-4 sm:px-6 lg:px-10 pt-10 pb-14">
            <div className="max-w-[560px]">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#f1f1ff] shadow mb-6">
                <img src="/dog-5.png" alt="logo" className="w-6 h-6 object-contain" />
              </div>

              <h1 className="text-[32px] md:text-[40px] font-semibold tracking-[.015em] mb-2">Welcome back!</h1>
              <p className="text-[15px] text-[var(--muted-fg)] mb-8">
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
                      className="jz-field w-full h-[50px] rounded-[10px] px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-[#6b6bff] outline-none"
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
                    className="jz-field w-full h-[50px] rounded-[10px] px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-[#6b6bff] outline-none"
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
                      className="jz-field w-full h-[50px] rounded-[10px] px-4 pr-10 ring-1 ring-gray-300 focus:ring-2 focus:ring-[#6b6bff] outline-none"
                      placeholder="Enter password"
                      required
                    />
                    <svg width="18" height="18" viewBox="0 0 24 24" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                    <label className="inline-flex items-center gap-2 text-[13px]">
                      <input type="checkbox" className="accent-[var(--joyzze-teal)]" defaultChecked />
                      Remember me
                    </label>
                    <a href="#" className="text-[13px] text-[#6b6bff] hover:underline">Forgot your password?</a>
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
                  <>Don’t have an account?{' '}
                    <button type="button" onClick={() => setMode('signup')} className="text-[#6b6bff] hover:underline">
                      Register here
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-[#6b6bff] hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </section>

          {/* right: hero image (hidden until lg) */}
          <section className="relative hidden lg:block min-h-[520px]">
            <img src="/dog-7.png" alt="hero dogs" className="w-full h-full object-cover" />
          </section>
        </div>
      </div>

      <Footer />

      {/* global styles tuned for responsiveness */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

        :root {
          --joyzze-teal: #1cd2c1;
          --page-bg: #f4f6f9;
          --page-fg: #0e0f11;
          --muted-fg: #6b7280;
          --header-top-bg: #e9eff5;
          --header-top-fg: #0e0f11;

          --field-bg: #ffffff;
          --field-fg: #0e0f11;
          --field-placeholder: #6b7280;
          --field-border: #d1d5db;
        }
        html.theme-dark {
          --page-bg: #0f1115;
          --page-fg: #f4f7fb;
          --muted-fg: #a3a9b6;
          --header-top-bg: #151922;
          --header-top-fg: #f4f7fb;

          --field-bg: #161a22;
          --field-fg: #f4f7fb;
          --field-placeholder: #9aa3b2;
          --field-border: rgba(255,255,255,.18);
        }
        html, body { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }

        /* input look (theme aware) */
        .jz-field { background: var(--field-bg)!important; color: var(--field-fg)!important; border-color: var(--field-border); }
        .jz-field::placeholder { color: var(--field-placeholder); }
        .google-btn { background:#fff; color:#3c4043; border:1px solid #dadce0; }
        .google-btn:disabled { opacity:.7; cursor:not-allowed; }

        /* keep logo from overlapping (no absolute positioning anywhere) */
        .jz-item { font-weight:600; font-size:15px; letter-spacing:.01em; }

        /* tiny breakpoint used above */
        @media (max-width: 380px){
          .jz-item { font-size:14px; }
        }
      `}</style>
    </main>
  );
}
