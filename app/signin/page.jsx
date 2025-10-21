'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/* ================================
   ICONS (header set + Email + Google G + ribbon icons)
   ================================ */
const Icon = {
  Phone: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/>
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Plus: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Shuffle: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p} style={{transform:'rotate(-8deg)'}}>
      <path d="M3 6h4l4 6 4 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 6h4l-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M11 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  User: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  CaretDown: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Bag: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Mail: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3.5 7 12 12.5 20.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  /* Official Google “G” */
  GoogleG: (p) => (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...p}>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.18-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.25h2.9c1.7-1.57 2.7-3.88 2.7-6.6z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.2l-2.9-2.25c-.8.54-1.82.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H1.9v2.33C3.38 15.98 6 18 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V4.97H1.9A8.96 8.96 0 0 0 0 9c0 1.45.35 2.82 1.9 4.03l2.05-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.33l2.56-2.56C13.47.89 11.43 0 9 0 6 0 3.38 2.02 1.9 4.97l2.05 2.33C4.66 5.16 6.65 3.58 9 3.58z"/>
    </svg>
  ),
  /* Ribbon icons */
  Truck: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 7h10v7H3zM13 11h4l4 4v3h-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="8" cy="18" r="1.9" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="18" cy="18" r="1.9" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Return: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 9v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M20 18a8 8 0 1 0-3.1-15.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Card: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Lock: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 11V9a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
};

/* ================================
   HEADER (with distinct mega links + hover color)
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
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll); };
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
                  className="jz-input h-[44px] w-[200px] max-w-[200px] rounded-md bg-white pl-10 pr-[44px] text-[13px] italic placeholder:italic placeholder:text-[#6b6b6b] outline-none ring-1 ring-black/10"
                  aria-label="Search"
                  autoComplete="off"
                />
              </form>
              <Icon.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0f0f0f]/85 pointer-events-none" />
              <Icon.Plus className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0f0f0f]/85 pointer-events-none" />
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

          {/* Distinct mega content per tab (matches inner app) */}
          {open && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[8px]" onMouseEnter={()=>setOpen(open)}>
              <div className="jz-mega w-[calc(100vw-32px)] max-w-[1280px]">
                <div className="jz-mega-bg" />
                <div className="relative grid grid-cols-3 gap-14 p-8">
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
   FOOTER with exact black promo ribbon
   ================================ */
function FooterPromoRibbon(){
  return (
    <div className="promo-wrap">
      <div className="promo-row">
        <div className="promo-item">
          <Icon.Truck className="promo-ico" />
          <span>Free Shipping on orders over $350</span>
        </div>
        <div className="promo-item">
          <Icon.Return className="promo-ico" />
          <span>Hassle Free Returns</span>
        </div>
        <div className="promo-item">
          <Icon.Card className="promo-ico" />
          <span>All Major Cards Accepted</span>
        </div>
        <div className="promo-item !border-r-0">
          <Icon.Lock className="promo-ico" />
          <span>100% Safe &amp; Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="bg-[#4a4a4a] text-slate-100 mt-auto">
      <FooterPromoRibbon />

      <div className="max-w-[1280px] mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
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
   AUTH PAGE — Template #1 layout
   ================================ */
const BRAND = { charcoal: '#2f2f31' };

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
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
    <main className="min-h-screen flex flex-col bg-white">
      <AppHeader />

      {/* Split layout to match template */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: form */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[480px]">
            <h1 className="text-[30px] md:text-[34px] font-semibold text-slate-900 mb-2">
              {mode === 'login' ? 'Welcome back !' : 'Create your account'}
            </h1>
            <p className="text-[14px] text-slate-500 mb-8">
              {mode === 'login'
                ? 'Enter to get unlimited access to data & information.'
                : 'Enter your details to get started.'}
            </p>

            <form onSubmit={handleCredentials}>
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-[14px] font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-[48px] rounded-lg border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-[#5a54f9]"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-[14px] font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your mail address"
                  className="w-full h-[48px] rounded-lg border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-[#5a54f9]"
                />
              </div>

              <div className="mb-2">
                <label className="block text-[14px] font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full h-[48px] rounded-lg border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-[#5a54f9]"
                />
              </div>

              <div className="mb-6 flex items-center justify-between text-[13px]">
                <label className="inline-flex items-center gap-2 select-none">
                  <input type="checkbox" checked={remember} onChange={()=>setRemember(!remember)} className="accent-[#5a54f9]" />
                  <span className="text-slate-700">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-[#5a54f9] hover:underline">Forgot your password ?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] rounded-lg bg-[#5a54f9] text-white font-medium shadow-sm hover:shadow transition"
              >
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </button>

              <div className="text-center my-4 text-[13px] text-slate-500">Or, Login with</div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                aria-label="Continue with Google"
                className="google-btn w-full h-[48px] rounded-lg font-medium shadow-sm hover:shadow-md transition flex items-center justify-center gap-3"
              >
                <Icon.GoogleG />
                <span>{mode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}</span>
              </button>

              <p className="mt-6 text-[13px] text-slate-600 text-center">
                {mode === 'login' ? (
                  <>
                    Don’t have an account?{' '}
                    <button type="button" onClick={()=>setMode('signup')} className="text-[#5a54f9] hover:underline">Register here</button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={()=>setMode('login')} className="text-[#5a54f9] hover:underline">Sign in</button>
                  </>
                )}
              </p>
            </form>
          </div>
        </section>

        {/* RIGHT: illustration block */}
        <aside className="hidden lg:block relative">
          <div className="auth-art absolute inset-0" />
        </aside>
      </div>

      <AppFooter />

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
        :root { --joyzze-teal: #1CD2C1; }
        html, body { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }

        .jz-nav, .jz-item, .jz-mega, .jz-sec-title, .jz-list, .jz-input { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }
        .jz-nav { font-weight:600; font-size:15px; letter-spacing:.01em; }
        .jz-item { padding:14px 20px; position:relative; line-height:1; color:#d7d7d7; text-decoration:none; border-radius:6px 6px 0 0; }
        .jz-item:hover { color:#00e1c9; background:linear-gradient(#f2f5f5,#eef6f6); }
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

        .jz-sec-title { margin-bottom:12px; color:#2f2f2f; font-weight:700; text-transform:uppercase; letter-spacing:.06em; font-size:14px; }
        .jz-list { list-style:none; padding:0; margin:0; }
        .jz-list li { padding:9px 0; border-bottom:1px solid rgba(0,0,0,.06); }
        .jz-list li:last-child { border-bottom:0; }
        .jz-list a { color:#3f3f3f; font-size:15px; }
        .jz-list a:hover { color:#111; text-decoration:none; }

        .jz-input:focus { box-shadow: 0 0 0 3px rgba(0,0,0,.06); }
        @media (max-width: 1280px){ .jz-input { width: 480px !important; } }
        @media (max-width: 1100px){ .jz-input { width: 360px !important; } }
        @media (max-width: 980px){ .jz-input { display:none; } }

        /* Promo ribbon */
        .promo-wrap{ background:#0a0a0a; border-bottom:2px solid var(--joyzze-teal); }
        .promo-row{ max-width:1280px; margin:0 auto; padding:10px 16px; display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:0; color:#f5f5f5; font-size:16px; line-height:1.25; }
        .promo-item{ display:flex; align-items:center; gap:12px; padding:8px 18px; border-right:1px solid var(--joyzze-teal); }
        .promo-ico{ color:#e8e8e8; opacity:.95; flex:0 0 auto; }
        @media (max-width: 900px){ .promo-row{ grid-template-columns:1fr 1fr; row-gap:8px; } .promo-item{ border-right:0; } }
        @media (max-width: 560px){ .promo-row{ grid-template-columns:1fr; } }

        /* Google button — brand-correct (white background, colored G) */
        .google-btn{ background:#fff; color:#3c4043; border:1px solid #dadce0; }
        .google-btn:disabled{ opacity:.7; cursor:not-allowed; }

        /* Right illustration panel (purple abstract like template) */
        .auth-art{
          background:
            radial-gradient(1200px 900px at 90% 10%, #2f1fb9 0%, #2c1a95 40%, #1a1675 60%, #15124e 100%),
            linear-gradient(135deg, #3023ae 0%, #5340ea 50%, #1a1675 100%);
        }
        .auth-art::after{
          content:'';
          position:absolute; inset:0;
          background:
            radial-gradient(200px 200px at 30% 25%, #ffd54a 0 40%, transparent 45%),
            radial-gradient(160px 160px at 65% 40%, #00e1c9 0 35%, transparent 40%),
            radial-gradient(260px 180px at 70% 75%, #2bd3ff 0 30%, transparent 40%),
            radial-gradient(120px 120px at 40% 80%, #6f5bff 0 35%, transparent 40%),
            radial-gradient(140px 100px at 85% 20%, rgba(255,255,255,.2) 0 50%, transparent 55%);
          opacity:.8; pointer-events:none;
        }
      `}</style>
    </main>
  );
}
