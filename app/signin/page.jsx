'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/* ================================
   ICONS (email, gmail + header set)
   ================================ */
const Icon = {
  Phone: (p)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/>
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Plus: (p)=>(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Shuffle: (p)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p} style={{transform:'rotate(-8deg)'}}>
      <path d="M3 6h4l4 6 4 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 6h4l-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M11 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  User: (p)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  CaretDown: (p)=>(
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Bag: (p)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Mail: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3.5 7 12 12.5 20.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Gmail: (p)=>(
    <svg width="20" height="20" viewBox="0 0 24 24" {...p}>
      <path fill="#fff" d="M2 7.5v9A2.5 2.5 0 0 0 4.5 19H8V9.8l4 3.2 4-3.2V19h3.5A2.5 2.5 0 0 0 22 16.5v-9l-10 7-10-7z"/>
      <path fill="#fff" opacity=".12" d="m12 12.5 10-7-10-4.2L2 5.5l10 7z"/>
    </svg>
  ),
};

/* ================================
   HEADER (same as inner webapp)
   ================================ */
function MegaSection({ title, children }) {
  return (
    <div>
      <p className="jz-sec-title">{title}</p>
      <ul className="jz-list">{children}</ul>
    </div>
  );
}

function AppHeader() {
  const [open, setOpen] = useState(null);
  const close = () => setOpen(null);

  useEffect(() => {
    const onKey = (e)=>{ if(e.key==='Escape') close(); };
    const onScroll = () => close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const NavItem = ({ id, href, children }) => {
    const active = open === id;
    return (
      <a
        href={href}
        className={`jz-item ${active ? 'text-white jz-active' : ''}`}
        onMouseEnter={() => setOpen(id)}
        onFocus={() => setOpen(id)}
        aria-haspopup="true"
        aria-expanded={active ? 'true' : 'false'}
      >
        <span>{children}</span>
        <svg className="caret" width="14" height="14" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span className="jz-underline" />
        <span className="jz-pointer" />
      </a>
    );
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* single row: phone | logo | search+icons */}
      <div className="bg-[#bdbdbd]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
          <a href="tel:(877) 456-9993" className="justify-self-start flex items-center gap-2 text-[#0f0f0f]">
            <Icon.Phone className="opacity-85" />
            <span className="text-[15px] font-semibold tracking-[.01em]">(877) 456-9993</span>
          </a>

          <a
            href="/"
            className="justify-self-center block rounded-[10px] overflow-hidden shadow-[0_12px_26px_rgba(0,0,0,.35)]"
            aria-label="Joyzze"
          >
            <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] px-7 py-2.5 rounded-[10px]">
              <img
                src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
                alt="Joyzze"
                className="h-[52px] w-auto align-middle"
                onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-[28px] font-semibold tracking-[0.25em] px-4">JOYZZE</span>';}}
              />
            </div>
          </a>

          <div className="justify-self-end flex items-center gap-4">
            <div className="relative hidden md:block">
              <form action="/search.php" method="get">
                <input
                  type="text"
                  name="search_query"
                  placeholder="Search..."
                  className="jz-input h-[44px] w-[200px] max-w-[200px] rounded-md bg-white pl-4 pr-[58px] text-[14px] italic placeholder:italic placeholder:text-[#6b6b6b] outline-none ring-1 ring-black/10"
                  aria-label="Search Raptor, c-series, Piranha..."
                  autoComplete="off"
                />
              </form>
              <Icon.Plus className="absolute right-[56px] top-1/2 -translate-y-1/2 text-[#0f0f0f]/85 pointer-events-none" />
              <button
                className="absolute right-[8px] top-1/2 -translate-y-1/2 h-[32px] w-[32px] grid place-items-center rounded-full bg-white ring-1 ring-black/15 hover:bg-black/5"
                aria-label="Search"
                type="submit"
              >
                <Icon.Search />
              </button>
            </div>

            <a className="hidden sm:grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" href="/compare" aria-label="Compare">
              <Icon.Shuffle />
            </a>
            <div className="hidden sm:flex items-center">
              <a className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" href="/account.php" aria-label="Account">
                <Icon.User />
              </a>
              <Icon.CaretDown className="ml-[2px] opacity-80" />
            </div>
            <a className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" href="/cart.php" aria-label="Cart">
              <Icon.Bag />
            </a>
          </div>
        </div>
      </div>

      {/* dark navbar + centered mega panel */}
      <nav className="bg-[#2f2f2f] text-[#d7d7d7] border-t border-black/10" onMouseLeave={close}>
        <div className="max-w-[1280px] mx-auto px-2 lg:px-4 relative">
          <div className="flex items-center">
            <div className="px-4 text-[22px] text-[var(--joyzze-teal)] select-none leading-[1]">ʝ</div>
            <div className="jz-nav flex items-stretch gap-[2px]">
              <NavItem id="all" href="https://joyzze.com/all-products/">All Products</NavItem>
              <NavItem id="clippers" href="https://joyzze.com/clippers/">Clippers</NavItem>
              <NavItem id="blades" href="https://joyzze.com/blades/">Blades</NavItem>
              <NavItem id="combs" href="https://joyzze.com/combs-accessories/">Combs &amp; Accessories</NavItem>
              <NavItem id="info" href="https://joyzze.com/information/">Information</NavItem>
              <a href="https://joyzze.com/recycling-sharpening/" className="jz-item">Recycling &amp; Sharpening</a>
              <a href="https://joyzze.com/distributor/" className="jz-item">Distributor</a>
            </div>
          </div>

          {/* DIFFERENT CONTENT PER TAB — same as inner app */}
          {open && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[8px]" onMouseEnter={()=>setOpen(open)}>
              <div className="jz-mega w-[calc(100vw-32px)] max-w-[1280px]">
                <div className="jz-mega-bg" />
                <div className="relative grid grid-cols-3 gap-14 p-8">

                  {/* ====== ALL PRODUCTS ====== */}
                  {open === 'all' && (
                    <>
                      <MegaSection title="CLIPPERS">
                        <li><a href="https://joyzze.com/raptor-falcon-a5-clippers/">Raptor &amp; Falcon | A-Series</a></li>
                        <li><a href="https://joyzze.com/hornet/">Hornet | C-Series</a></li>
                        <li><a href="https://joyzze.com/stinger/">Stinger | C-Series</a></li>
                        <li><a href="https://joyzze.com/piranha/">Piranha | D-Series</a></li>
                        <li><a href="https://joyzze.com/hornet-mini/">Hornet Mini | M-Series</a></li>
                      </MegaSection>
                      <MegaSection title="BLADES">
                        <li><a href="https://joyzze.com/a-series-raptor/">A-Series | Raptor &amp; Falcon</a></li>
                        <li><a href="https://joyzze.com/a-series-raptor-falcon-wide/">A-Series | Raptor &amp; Falcon | Wide</a></li>
                        <li><a href="https://joyzze.com/c-series-hornet-stinger-blades-all/">C-Series | Hornet &amp; Stinger</a></li>
                        <li><a href="https://joyzze.com/d-series-piranha/">D-Series | Piranha</a></li>
                        <li><a href="https://joyzze.com/m-series-hornet-mini/">M-Series | Hornet Mini</a></li>
                      </MegaSection>
                      <MegaSection title="COMBS & ACCESSORIES">
                        <li><a href="https://joyzze.com/cases-all-products/">Cases</a></li>
                        <li><a href="https://joyzze.com/joyzze-combs/">Combs</a></li>
                        <li><a href="https://joyzze.com/blade-scissor-oil-all-products/">Blade &amp; Scissor Oil</a></li>
                        <li><a href="https://joyzze.com/multi-functional-tool-bag/">Multi-Functional Tool Bag</a></li>
                      </MegaSection>
                    </>
                  )}

                  {/* ====== CLIPPERS ====== */}
                  {open === 'clippers' && (
                    <>
                      <MegaSection title="5-IN-1 CLIPPERS | C-SERIES">
                        <li><a href="https://joyzze.com/hornet-clippers-5-in-1/">Hornet</a></li>
                        <li><a href="https://joyzze.com/stinger-clippers-5-in-1/">Stinger</a></li>
                      </MegaSection>
                      <MegaSection title="A5 STYLE CLIPPERS | A-SERIES">
                        <li><a href="https://joyzze.com/falcon/">Falcon</a></li>
                        <li><a href="https://joyzze.com/raptor-clippers/">Raptor</a></li>
                      </MegaSection>
                      <MegaSection title="D-SERIES CLIPPERS">
                        <li><a href="https://joyzze.com/piranha-clippers/">Piranha</a></li>
                        <li className="mt-2" />
                        <li className="jz-sec-title !mb-2">PARTS</li>
                        <li><a href="https://joyzze.com/a5-falcon/">A5 Falcon</a></li>
                        <li><a href="https://joyzze.com/a5-raptor/">A5 Raptor</a></li>
                      </MegaSection>
                      <MegaSection title="MINI TRIMMERS | M-SERIES">
                        <li><a href="https://joyzze.com/hornet-mini-clippers/">Hornet Mini</a></li>
                      </MegaSection>
                    </>
                  )}

                  {/* ====== BLADES ====== */}
                  {open === 'blades' && (
                    <>
                      <MegaSection title="A-SERIES | A5 STYLE">
                        <li><a href="https://joyzze.com/a5-blades/">A5 Blades</a></li>
                      </MegaSection>
                      <MegaSection title="A-SERIES - WIDE | A5 STYLE">
                        <li><a href="https://joyzze.com/wide-blades-a-series/">Wide Blades</a></li>
                        <li><a href="https://joyzze.com/joyzze-bundle-plus/">Bundle Plus</a></li>
                        <li><a href="https://joyzze.com/joyzze-bundle/">Bundle</a></li>
                      </MegaSection>
                      <MegaSection title="C-SERIES | 5-IN-1 CLIPPERS">
                        <li><a href="https://joyzze.com/c-max-blades/">C-MAX Blades</a></li>
                      </MegaSection>
                      <MegaSection title="M-SERIES | MINI TRIMMERS">
                        <li><a href="https://joyzze.com/mini-trimmer-blades/">Mini Trimmer Blades</a></li>
                      </MegaSection>
                    </>
                  )}

                  {/* ====== COMBS & ACCESSORIES ====== */}
                  {open === 'combs' && (
                    <>
                      <MegaSection title="A-SERIES | WIDE COMBS">
                        <li><a href="https://joyzze.com/a-series-wide-metal-combs/">Wide Metal Combs</a></li>
                        <li><a href="https://joyzze.com/bundle/">Bundle</a></li>
                        <li><a href="https://joyzze.com/bundle-plus/">Bundle Plus</a></li>
                      </MegaSection>
                      <MegaSection title="A & D SERIES | RAPTOR/FALCON/PIRANHA">
                        <li><a href="https://joyzze.com/a-d-series-8-piece-metal-comb-set/">8 Piece Metal Comb Set</a></li>
                      </MegaSection>
                      <MegaSection title="C-SERIES | STINGER & HORNET">
                        <li><a href="https://joyzze.com/c-series-8-piece-metal-comb-set/">8 Piece Metal Comb Set</a></li>
                      </MegaSection>
                      <MegaSection title="CASES">
                        <li><a href="https://joyzze.com/12-slot/">12-Slot</a></li>
                        <li><a href="https://joyzze.com/22-slot/">22-Slot</a></li>
                      </MegaSection>
                    </>
                  )}

                  {/* ====== INFORMATION ====== */}
                  {open === 'info' && (
                    <>
                      <MegaSection title="ABOUT JOYZZE™">
                        <li><a href="https://joyzze.com/information/about-joyzze/">About JOYZZE™</a></li>
                        <li><a href="https://joyzze.com/information/faqs/">FAQs</a></li>
                        <li><a href="https://joyzze.com/joyzze-privacy-policy/">Privacy Policy</a></li>
                      </MegaSection>
                      <MegaSection title="SUPPORT">
                        <li><a href="https://joyzze.com/information/contact/">Contact</a></li>
                        <li><a href="https://joyzze.com/information/shipping-returns/">Shipping &amp; Returns</a></li>
                        <li><a href="https://joyzze.com/accessibility-statement/">Accessibility</a></li>
                      </MegaSection>
                      <MegaSection title="DOCS">
                        <li><a href="https://joyzze.com/clipper-repair-form-joyzze/">JOYZZE™ Clipper Repair Form</a></li>
                        <li><a href="https://joyzze.com/warranty-joyzze/">Warranty</a></li>
                        <li><a href="https://joyzze.com/joyzze-product-brochure/">JOYZZE Product Brochure</a></li>
                        <li><a href="https://joyzze.com/educational/">Educational</a></li>
                        <li><a href="https://joyzze.com/information/terms-conditions/">Terms &amp; Conditions</a></li>
                      </MegaSection>
                    </>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ================================
   FOOTER (same as inner webapp)
   ================================ */
function FooterPromoRibbon(){
  return (
    <div className="bg-[#0e0e0e] text-[#d9d9d9]">
      <div className="max-w-[1280px] mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-6 text-[13px]">
        <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[var(--joyzze-teal)]" />Free Shipping on orders over $350</div>
        <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[var(--joyzze-teal)]" />Hassle Free Returns</div>
        <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[var(--joyzze-teal)]" />All Major Cards Accepted</div>
        <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[var(--joyzze-teal)]" />100% Safe &amp; Secure Checkout</div>
      </div>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="bg-[#4a4a4a] text-slate-100 mt-auto">
      <FooterPromoRibbon />

      <div className="max-w-[1280px] mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        {/* Left: Links */}
        <div>
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">LINKS</h4>
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

        {/* Middle: Logo + contact */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] rounded-lg px-7 py-3 shadow">
            <img src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png" alt="Joyzze" className="h-9 w-auto" onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>'}}/>
          </div>
          <p className="mt-3 text-sm text-white/80">Joy of Grooming Made Easy™</p>

          <div className="mt-6 space-y-1 text-[15px] text-slate-100">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com" className="hover:underline">info@joyzze.com</a></div>
          </div>
        </div>

        {/* Right: Newsletter */}
        <div className="lg:justify-self-end">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="flex items-stretch w-full max-w-[360px]" onSubmit={(e)=>e.preventDefault()}>
            <input type="email" placeholder="Email address..." className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none"/>
            <button type="submit" className="px-4 rounded-r-md bg-[var(--joyzze-teal)] text-black text-sm font-semibold">✉</button>
          </form>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-10">
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-white/80">© {new Date().getFullYear()} Joyzze . All rights reserved. | Sitemap</div>
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

/* ================================
   AUTH PAGE
   ================================ */
const BRAND = { charcoal: '#2f2f31' };

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
    } finally { setLoading(false); }
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
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error) {
        alert('Authentication failed. Please check your credentials.');
      } else {
        router.push(result?.url || '/');
      }
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#f2f3f5]">
      <AppHeader />

      {/* Auth card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] rounded-xl px-3 py-2 shadow">
                <span className="text-white text-lg leading-none">ʝ</span>
              </div>
              <div>
                <h1 className="text-[18px] font-semibold text-slate-800">Joyzze — Dog Groomer</h1>
                <p className="text-xs text-slate-500">
                  {mode === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCredentials} className="mb-4">
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl px-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                style={{ backgroundColor: BRAND.charcoal }}
                disabled={loading}
              >
                <Icon.Mail className="text-white" />
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
              className="w-full h-11 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              style={{ backgroundColor: '#DB4437' }}
              onClick={handleGoogle}
              disabled={loading}
            >
              <Icon.Gmail />
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

      <AppFooter />

      {/* Shared global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
        :root { --joyzze-teal: #1CD2C1; }
        html, body { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }

        .jz-nav, .jz-item, .jz-mega, .jz-sec-title, .jz-list, .jz-input { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }
        .jz-nav { font-weight:600; font-size:15px; letter-spacing:.01em; }
        .jz-item { padding:14px 20px; position:relative; line-height:1; color:#d7d7d7; text-decoration:none; }
        .jz-item:hover { color:#fff; }
        .caret { margin-left:6px; opacity:.75; transition:transform .18s ease, opacity .18s ease; }
        .jz-item.jz-active .caret, .jz-item:hover .caret { transform:translateY(1px) rotate(180deg); opacity:1; }

        .jz-underline { position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--joyzze-teal); opacity:0; transition:opacity .18s ease; }
        .jz-pointer { position:absolute; left:50%; transform:translateX(-50%); bottom:-6px; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid var(--joyzze-teal); opacity:0; transition:opacity .18s ease; }
        .jz-item.jz-active .jz-underline, .jz-item:hover .jz-underline,
        .jz-item.jz-active .jz-pointer,   .jz-item:hover .jz-pointer { opacity:1; }

        .jz-mega {
          position: relative;
          border: 1px solid rgba(28,210,193,.85);
          border-top-width: 3px;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(1px);
          box-shadow: 0 32px 64px -20px rgba(0,0,0,.35), 0 12px 24px rgba(0,0,0,.12);
          border-radius: 2px;
          overflow: hidden;
          z-index: 60;
        }
        .jz-mega-bg {
          position:absolute; inset:0;
          background-image: radial-gradient(1000px 440px at 75% 18%, rgba(0,0,0,.08), transparent 60%);
          opacity:.14; pointer-events:none; border-radius:2px;
        }

        .jz-sec-title {
          margin-bottom:12px; color:#2f2f2f; font-weight:700;
          text-transform:uppercase; letter-spacing:.06em; font-size:14px;
        }
        .jz-list { list-style:none; padding:0; margin:0; }
        .jz-list li { padding:9px 0; border-bottom:1px solid rgba(0,0,0,.06); }
        .jz-list li:last-child { border-bottom:0; }
        .jz-list a { color:#3f3f3f; font-size:15px; }
        .jz-list a:hover { color:#111; text-decoration:none; }

        .jz-input:focus { box-shadow: 0 0 0 3px rgba(0,0,0,.06); }
        @media (max-width: 1280px){ .jz-input { width: 520px !important; } }
        @media (max-width: 1100px){ .jz-input { width: 420px !important; } }
        @media (max-width: 980px){ .jz-input { display:none; } }
      `}</style>
    </main>
  );
}
