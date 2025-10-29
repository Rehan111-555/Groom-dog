'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────── Icons ─────────────────── */
const Icon = {
  Upload: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Wand: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Reset: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Download: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Phone: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0  0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
  Truck: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 6h10v8H3zM13 10h4l4 4v4h-4M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Return: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M20 18a8 8 0 1 0-3.1-15.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  Card: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Lock: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
  Sun: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Moon: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M21 12.3A8.5 8.5 0 1 1 11.7 3 7 7 0 0 0 21 12.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Menu: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Close: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

/* ─────────────────── Small UI helpers ─────────────────── */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className="", children }) => <div className={`card ${className}`}>{children}</div>;

/* ─────────────────── Utility ─────────────────── */
function pickResultUrl(data){
  if (data && typeof data === "object") {
    if (typeof data.image === "string" && data.image.length) {
      return data.image.indexOf("data:")===0 ? data.image : `data:image/png;base64,${data.image}`;
    }
    if (typeof data.url === "string" && data.url.length) return data.url;
  }
  return null;
}
function validateImageFile(f,maxMB=12){
  if (!f || typeof f!=="object") return "Invalid file.";
  const type = String(f.type||"");
  const size = Number(f.size||0);
  if (type.indexOf("image/")!==0) return "Please upload an image file.";
  if (size > maxMB*1024*1024) return `Image too large. Please keep it under ${maxMB}MB.`;
  return null;
}
async function safeReadText(res){ try{return await res.text();}catch{ return ""; } }
function readImageSize(url){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.crossOrigin='anonymous';
    img.onload=()=>resolve({w: img.naturalWidth, h: img.naturalHeight});
    img.onerror=reject;
    img.src=url;
  });
}
async function padToSize(dataUrl, targetW, targetH) {
  const img = new Image(); img.src = dataUrl; await new Promise(r => (img.onload = r));
  const canvas = document.createElement("canvas"); canvas.width = targetW; canvas.height = targetH;
  const ctx = canvas.getContext("2d"); ctx.clearRect(0,0,targetW,targetH);
  const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
  const nw = Math.round(img.naturalWidth * scale); const nh = Math.round(img.naturalHeight * scale);
  const dx = Math.floor((targetW - nw) / 2); const dy = Math.floor((targetH - nh) / 2);
  ctx.drawImage(img, dx, dy, nw, nh); return canvas.toDataURL("image/png");
}

/* ─────────────────── Compare slider ─────────────────── */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none" style={{ touchAction: 'none' }}>
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false}/>
      <img src={beforeSrc} alt="Before" className="absolute inset-0 h-full w-full object-contain" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false}/>
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(79,70,229,0.9)' }} />
      <div className="absolute bottom-2 left-3 right-3">
        <input type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full"/>
      </div>
    </div>
  );
}

/* =========================================================
   Upload + Result
   ========================================================= */
function UploadAndResult(){
  const [file,setFile]=useState(null);
  const [previewUrl,setPreviewUrl]=useState(null);
  const [resultUrl,setResultUrl]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [progress,setProgress]=useState(0);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [urlText, setUrlText] = useState("");
  const controllerRef=useRef(null);

  const [panelH, setPanelH] = useState(400);
  const ACTION_H = 56;

  const leftTopRef = useRef(null);
  const rightTitleRef = useRef(null);
  const [spacerH, setSpacerH] = useState(0);

  useEffect(() => {
    const setH = () => {
      const isMobile = window.innerWidth < 768;
      const h = isMobile 
        ? Math.round(Math.max(300, Math.min(400, window.innerHeight * 0.4)))
        : Math.round(Math.max(520, Math.min(820, window.innerHeight * 0.72)));
      setPanelH(h);
    };
    setH();
    window.addEventListener('resize', setH);
    return () => window.removeEventListener('resize', setH);
  }, []);

  useEffect(() => {
    const measure = () => {
      const L = leftTopRef.current?.getBoundingClientRect()?.height || 0;
      const R = rightTitleRef.current?.getBoundingClientRect()?.height || 0;
      setSpacerH(Math.max(0, Math.round(L - R)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (leftTopRef.current) ro.observe(leftTopRef.current);
    if (rightTitleRef.current) ro.observe(rightTitleRef.current);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [urlText, previewUrl, panelH]);

  useEffect(() => {
    return () => {
      if (previewUrl && typeof previewUrl === 'string' && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (resultUrl && typeof resultUrl === 'string' && resultUrl.startsWith && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFile = async (f) => {
    setError(null);
    const validationError = validateImageFile(f, 12);
    if (validationError){ setError(validationError); return; }
    const url = URL.createObjectURL(f);
    setFile(f); setResultUrl(null); setPreviewUrl(url);
    try { const { w, h } = await readImageSize(url); setImgW(w); setImgH(h); } catch {}
  };
  const selectFile=(e)=>{ const f=e?.target?.files?.[0]; if(f)handleFile(f); };

  const handleUrlLoad = async () => {
    const u = urlText.trim();
    if (!u) return;
    setError(null);
    setFile(null);
    setResultUrl(null);
    setPreviewUrl(u);
    try { const { w,h } = await readImageSize(u); setImgW(w); setImgH(h); } catch {}
  };

  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setUrlText(""); setResultUrl(null); setProgress(0); setError(null); };

  const groom=async()=>{
    if(!file && !previewUrl) return;
    setLoading(true); setError(null); setProgress(12);
    controllerRef.current=new AbortController();
    try{
      const form=new FormData();
      if (file) form.append("image",file); else form.append("image_url", previewUrl);
      form.append("dog_only","true");
      if (imgW && imgH) { form.append("target_w", String(imgW)); form.append("target_h", String(imgH)); }

      const res=await fetch("/api/groom",{ method:"POST", body:form, signal:controllerRef.current?.signal });
      setProgress(60);
      if(!res.ok){ const msg=await safeReadText(res); throw new Error(msg||`Backend error (${res.status})`); }
      const data=await res.json();
      const url=pickResultUrl(data);
      if(!url) throw new Error("Unexpected response from backend.");
      try {
        const { w, h } = await readImageSize(url);
        if (imgW && imgH && (w !== imgW || h !== imgH)) setResultUrl(await padToSize(url, imgW, imgH));
        else setResultUrl(url);
      } catch { setResultUrl(url); }
      setProgress(100);
    }catch(e){ setError(e?.message||"Something went wrong."); }
    finally{ setLoading(false); }
  };

  const cancel=()=>{ controllerRef.current?.abort(); setLoading(false); };

  const hasInput = !!previewUrl;

  return (
    <section id="app" className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-8 h-8 md:w-10 md:h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-[#00e1c9]">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-[var(--app-muted)] max-w-md">Upload a dog photo → AI grooms the dog → compare before &amp; after</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-primary w-full sm:w-auto justify-center" href={resultUrl} download><Icon.Download /> Download</a>
        ) : <div className="h-9 hidden sm:block" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-stretch">
        <Card className="p-3 md:p-4">
          <div ref={leftTopRef}>
            <div className="mb-2 text-sm font-semibold invisible">Upload</div>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-3">
              <input
                type="url"
                value={urlText}
                onChange={(e)=>setUrlText(e.target.value)}
                placeholder="Paste image URL…"
                className="flex-1 min-w-0 px-3 py-2 rounded-md ring-1 ring-[var(--app-border)] bg-[var(--app-surface)] text-inherit outline-none text-sm"
              />
              <button className="btn btn-ghost sm:w-auto w-full justify-center">Load</button>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[var(--app-border)] bg-[var(--app-surface)]" style={{ height: panelH, position:'relative' }}>
            <label className="absolute inset-0 grid place-items-center text-center cursor-pointer p-4">
              {!hasInput && (
                <div className="grid place-items-center gap-2 md:gap-3 text-[var(--app-muted)]">
                  <div className="mx-auto w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-[var(--app-surface)] grid place-items-center shadow ring-1 ring-[var(--app-border)]"><Icon.Upload /></div>
                  <div className="font-medium text-sm md:text-base">Drag &amp; drop or click to upload</div>
                  <div className="text-xs">PNG, JPG up to 12MB</div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={selectFile}/>
            </label>

            {hasInput && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-2 sm:gap-3 rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 bg-black/5 dark:bg.white/5 ring-1 ring-[var(--app-border)] max-w-[90%]">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-black/10 flex-shrink-0">
                  <img src={previewUrl} alt="thumb" className="w-full h-full object-cover"/>
                </div>
                <div className="max-w-[140px] sm:max-w-[220px] text-xs leading-5 overflow-hidden">
                  <div className="truncate">Selected image</div>
                  <div className="opacity-70 truncate">{file?.name || previewUrl}</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 h-auto min-h-[56px] flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-3">
            {!loading ? (
              <>
                <Button className="btn-primary w-full sm:w-auto justify-center" onClick={groom}><Icon.Wand /> Groom</Button>
                <Button className="btn-ghost w-full sm:w-auto justify-center" onClick={resetAll}><Icon.Reset /> Reset</Button>
                {error && <span className="text-red-500 text-sm text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">{String(error)}</span>}
              </>
            ) : (
              <>
                <Button className="btn-primary w-full sm:w-auto justify-center" disabled><Icon.Wand /> Working… {progress}%</Button>
                <Button className="btn-ghost w-full sm:w-auto justify-center" onClick={cancel}><Icon.Reset /> Cancel</Button>
              </>
            )}
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div style={{ height: spacerH }} aria-hidden="true" />
          <div ref={rightTitleRef} className="mb-2 text-sm font-semibold">Groomed dog using hornet</div>
          <div className="rounded-2xl overflow-hidden" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 dark:bg-[var(--app-surface)] dark:border-[var(--app-border)] text-sm text-slate-600 text-center dark:text-[var(--app-muted)] p-4">
                Your groomed image will appear here. After processing, use the slider to compare before/after.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} />
            )}
          </div>
          <div style={{ height: ACTION_H }} />
        </Card>
      </div>
    </section>
  );
}

/* =========================================================
   HEADER + NAV + MEGA MENU
   ========================================================= */
function MegaSection({ title, children }) {
  return (
    <div>
      <p className="jz-sec-title">{title}</p>
      <ul className="jz-list">{children}</ul>
    </div>
  );
}

function SigninHeader({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const close = () => setOpen(null);

  useEffect(() => {
    const onKey = (e)=>{ if(e.key==='Escape') close(); };
    const onScroll = () => { close(); setMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Single place to "delegate" hover based on data-nav
  const onNavOver = (e) => {
    const el = e.target.closest('[data-nav]');
    if (el) setOpen(el.getAttribute('data-nav'));
  };

  const NavItem = ({ id, href, children }) => {
    const active = open === id;
    return (
      <a
        href={href}
        data-nav={id}
        className={`jz-item ${active ? 'jz-active' : ''}`}
        onMouseOver={onNavOver}
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

  const MobileNavItem = ({ id, href, children, onClick }) => {
    return (
      <a
        href={href}
        className="mobile-nav-item"
        onClick={onClick}
      >
        {children}
      </a>
    );
  };

  const headerStyle = { background: 'var(--header-bg)', color: 'var(--header-text)' };

  return (
    <header className="w-full">
      {/* sticky container isolated to create a clear stacking context */}
      <div className="sticky top-0 z-[1200]" style={{ isolation: 'isolate' }}>
        {/* Top row: FULL-WIDTH so right block sits near scrollbar */}
        <div style={headerStyle}>
          <div className="w-full px-3 sm:px-4 lg:px-6 h-16 sm:h-[72px] grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Mobile menu button */}
            <button 
              className="sm:hidden icon-btn w-9 h-9 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <Icon.Close /> : <Icon.Menu />}
            </button>

            {/* Phone top-left - hidden on mobile */}
            <a href="tel:(877) 456-9993" className="hidden sm:flex justify-self-start items-center gap-2" style={{color:'var(--header-text)'}}>
              <Icon.Phone className="opacity-85" />
              <span className="text-[15px] font-semibold tracking-[.01em]">(877) 456-9993</span>
            </a>

            {/* Centered logo */}
            <a
              href="https://joyzze.com/"
              className="justify-self-center sm:justify-self-center block rounded-[10px] overflow-hidden shadow-[0_12px_26px_rgba(0,0,0,.35)]"
              aria-label="Joyzze"
            >
              <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-[10px]">
                <img
                  src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
                  alt="Joyzze"
                  className="h-8 sm:h-[52px] w-auto align-middle"
                  onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-lg sm:text-[28px] font-semibold tracking-[0.25em] px-2 sm:px-4">JOYZZE</span>'}}
                />
              </div>
            </a>

            {/* Search + icons top-right, flush to edge */}
            <div className="justify-self-end flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <form action="/search.php" method="get">
                  <input
                    type="text"
                    name="search_query"
                    placeholder="Search..."
                    className="jz-input h-[44px] w-[140px] lg:w-[200px] rounded-md pl-4 pr-[58px] text-[14px] italic placeholder:italic outline-none ring-1"
                    autoComplete="off"
                  />
                </form>
                <Icon.Plus className="search-plus absolute right-[56px] top-1/2 -translate-y-1/2 pointer-events-none" />
                <button className="search-btn absolute right-[8px] top-1/2 -translate-y-1/2 h-[32px] w-[32px] grid place-items-center rounded-full" aria-label="Search">
                  <Icon.Search />
                </button>
              </div>

              <a className="hidden sm:grid icon-btn w-9 h-9 rounded-md" href="/compare" aria-label="Compare"><Icon.Shuffle /></a>
              <div className="hidden sm:flex items-center">
                <a className="icon-btn w-9 h-9 rounded-md" href="/account.php" aria-label="Account"><Icon.User /></a>
                <Icon.CaretDown className="ml-[2px] opacity-80" />
              </div>
              <a className="icon-btn w-9 h-9 rounded-md" href="/cart.php" aria-label="Cart"><Icon.Bag /></a>

              <button onClick={onToggleTheme} className="theme-toggle icon-btn h-9 px-2 rounded-md hidden sm:flex items-center gap-2" aria-label="Toggle theme">
                {theme === 'light' ? <Icon.Sun/> : <Icon.Moon/>}
                <span className="text-[13px] hidden lg:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden fixed inset-0 z-[1300] bg-white dark:bg-gray-900 pt-16">
            <div className="p-4 overflow-y-auto h-full">
              <div className="mb-6">
                <div className="relative mb-4">
                  <form action="/search.php" method="get">
                    <input
                      type="text"
                      name="search_query"
                      placeholder="Search..."
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      autoComplete="off"
                    />
                  </form>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <Icon.Search />
                  </button>
                </div>
                
                <a href="tel:(877) 456-9993" className="flex items-center gap-2 py-3 text-lg">
                  <Icon.Phone />
                  <span>(877) 456-9993</span>
                </a>
              </div>

              <nav className="space-y-1">
                <MobileNavItem href="https://joyzze.com/all-products/" onClick={() => setMobileMenuOpen(false)}>All Products</MobileNavItem>
                <MobileNavItem href="https://joyzze.com/clippers/" onClick={() => setMobileMenuOpen(false)}>Clippers</MobileNavItem>
                <MobileNavItem href="https://joyzze.com/blades/" onClick={() => setMobileMenuOpen(false)}>Blades</MobileNavItem>
                <MobileNavItem href="https://joyzze.com/combs-accessories/" onClick={() => setMobileMenuOpen(false)}>Combs & Accessories</MobileNavItem>
                <MobileNavItem href="https://joyzze.com/information/" onClick={() => setMobileMenuOpen(false)}>Information</MobileNavItem>
                <MobileNavItem href="https://joyzze.com/recycling-sharpening/" onClick={() => setMobileMenuOpen(false)}>Recycling & Sharpening</MobileNavItem>
                <MobileNavItem href="https://joyzze.com/distributor/" onClick={() => setMobileMenuOpen(false)}>Distributor</MobileNavItem>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onToggleTheme} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md border border-gray-300 dark:border-gray-600">
                  {theme === 'light' ? <Icon.Sun/> : <Icon.Moon/>}
                  <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ½-inch gap - hidden on mobile */}
        <div style={{ background: 'var(--header-bg)', height: '0.5in' }} aria-hidden="true" className="hidden sm:block" />

        {/* Navbar row - hidden on mobile */}
        <nav className="nav-dark hidden sm:block">
          <div className="max-w-[1280px] mx-auto px-2 lg:px-4 relative">
            <div className="flex items-center">
              <div className="px-4 text-[22px] text-[var(--joyzze-teal)] select-none leading-[1]">ʝ</div>

              {/* DELEGATED HOVER: parent listens, items set data-nav */}
              <div
                className="jz-nav flex items-stretch gap-[2px]"
                onMouseOver={onNavOver}
                onMouseLeave={() => setOpen(null)}
              >
                <NavItem id="all" href="https://joyzze.com/all-products/">All Products</NavItem>
                <NavItem id="clippers" href="https://joyzze.com/clippers/">Clippers</NavItem>
                <NavItem id="blades" href="https://joyzze.com/blades/">Blades</NavItem>
                <NavItem id="combs" href="https://joyzze.com/combs-accessories/">Combs &amp; Accessories</NavItem>
                <NavItem id="info" href="https://joyzze.com/information/">Information</NavItem>
                <NavItem id="recycling" href="https://joyzze.com/recycling-sharpening/">Recycling &amp; Sharpening</NavItem>
                <NavItem id="dist" href="https://joyzze.com/distributor/">Distributor</NavItem>
              </div>
            </div>

            {open && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full"
                onMouseEnter={()=>setOpen(open)}
                onMouseLeave={close}
              >
                <div className="jz-mega w-[calc(100vw-32px)] max-w-[1280px]">
                  <div className="jz-mega-bg" />
                  <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-14 p-4 md:p-6 lg:p-8">
                    {/* All Products */}
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

                    {/* Clippers */}
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

                    {/* Blades */}
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

                    {/* Combs & Accessories */}
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

                    {/* Information */}
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

                    {/* Recycling */}
                    {open === 'recycling' && (
                      <>
                        <MegaSection title="RECYCLING & SHARPENING">
                          <li><a href="https://joyzze.com/recycling-sharpening/">Program Overview</a></li>
                          <li><a href="https://joyzze.com/recycling-sharpening/#shipping">Shipping</a></li>
                          <li><a href="https://joyzze.com/recycling-sharpening/#faq">FAQ</a></li>
                        </MegaSection>
                      </>
                    )}

                    {/* Distributor */}
                    {open === 'dist' && (
                      <>
                        <MegaSection title="DISTRIBUTOR">
                          <li><a href="https://joyzze.com/distributor/">Find a Distributor</a></li>
                          <li><a href="https://joyzze.com/distributor/#become">Become a Distributor</a></li>
                        </MegaSection>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* =========================================================
   HERO / HOW / SAMPLES
   ========================================================= */
function Hero(){
  return (
    <header className="relative overflow-hidden text-white"
      style={{background: 'linear-gradient(135deg,#2a2f36 0%, #22262c 45%, #1a1e24 100%)'}}>
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-4 md:mb-6">Joyzze</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-[#00e1c9]">with AI</span>
          </h1>
          <p className="mt-4 text-slate-200/90 max-w-xl mx-auto lg:mx-0">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>. Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <a href="#app" className="btn btn-primary w-full sm:w-auto justify-center">Try it free</a>
            <a href="#how" className="btn text-white border border-white/20 bg-[#121a2b] w-full sm:w-auto justify-center">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 max-w-2xl mx-auto w-full">
          <img src="/dog-10.png" alt="Hero sample" className="w-full h-auto object-cover" />
        </div>
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 dark:text-[var(--app-muted)] mb-8 md:mb-10 max-w-2xl mx-auto">Upload your photo → AI grooms the dog → compare before &amp; after.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        <Card className="p-4 md:p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600 dark:text-[var(--app-muted)] flex-grow">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-full md:w-[146px] justify-center">Upload now</a>
          </div>
        </Card>

        <Card className="p-4 md:p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600 dark:text-[var(--app-muted)] flex-grow">We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-full md:w-[146px] justify-center">Start grooming</a>
          </div>
        </Card>

        <Card className="p-4 md:p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600 dark:text-[var(--app-muted)] flex-grow">Use the slider to compare before/after. Download the result in one click.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-full md:w-[146px] justify-center">Try the slider</a>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Samples(){
  return (
    <section id="examples" className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 dark:text-[var(--app-muted)] mb-8 md:mb-10 max-w-2xl mx-auto">Background, breed, pose, lighting and colors stay identical—only grooming changes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-[var(--app-border)]"><img src="/dog-1.jpg" alt="Sample 1" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-[var(--app-border)]"><img src="/dog-2.jpg" alt="Sample 2" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-[var(--app-border)]"><img src="/dog-3.jpg" alt="Sample 3" className="w-full h-auto object-cover" /></div>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */
function FooterPromoRibbon(){
  return (
    <div className="bg-[#0e0e0e] text-[#d9d9d9]">
      <div className="max-w-[1280px] mx-auto px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-[13px]">
        <div className="flex items-center gap-3 justify-center sm:justify-start"><Icon.Truck className="text-[var(--joyzze-teal)] flex-shrink-0" /><span className="text-center sm:text-left">Free Shipping on orders over $350</span></div>
        <div className="flex items-center gap-3 justify-center sm:justify-start"><Icon.Return className="text-[var(--joyzze-teal)] flex-shrink-0" /><span className="text-center sm:text-left">Hassle Free Returns</span></div>
        <div className="flex items-center gap-3 justify-center sm:justify-start"><Icon.Card className="text-[var(--joyzze-teal)] flex-shrink-0" /><span className="text-center sm:text-left">All Major Cards Accepted</span></div>
        <div className="flex items-center gap-3 justify-center sm:justify-start"><Icon.Lock className="text-[var(--joyzze-teal)] flex-shrink-0" /><span className="text-center sm:text-left">100% Safe &amp; Secure Checkout</span></div>
      </div>
    </div>
  );
}

function SigninFooter() {
  return (
    <footer className="bg-[#4a4a4a] text-slate-100">
      <FooterPromoRibbon />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="text-center lg:text-left">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">LINKS</h4>
          <ul className="space-y-2 text-[15px] text-slate-200/90">
            <li><a href="https://joyzze.com/all-products/" className="hover:underline block py-1">All Products</a></li>
            <li><a href="https://joyzze.com/clippers/" className="hover:underline block py-1">Clippers</a></li>
            <li><a href="https://joyzze.com/blades/" className="hover:underline block py-1">Blades</a></li>
            <li><a href="https://joyzze.com/combs-accessories/" className="hover:underline block py-1">Combs &amp; Accessories</a></li>
            <li><a href="https://joyzze.com/information/" className="hover:underline block py-1">Information</a></li>
            <li><a href="https://joyzze.com/recycling-sharpening/" className="hover:underline block py-1">Recycling &amp; Sharpening</a></li>
            <li><a href="https://joyzze.com/distributor/" className="hover:underline block py-1">Distributor</a></li>
            <li><a href="https://joyzze.com/sitemap.php" className="hover:underline block py-1">View All</a></li>
          </ul>
        </div>

        <div className="text-center order-first lg:order-none">
          <div className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] rounded-lg px-7 py-3 shadow mb-4">
            <img
              src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
              alt="Joyzze"
              className="h-9 w-auto mx-auto"
              onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>'}}
            />
          </div>
          <p className="mt-3 text-sm text-white/80">Joy of Grooming Made Easy™</p>

          <div className="mt-6 space-y-1 text-[15px] text-slate-100">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com" className="hover:underline">info@joyzze.com</a></div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a className="w-9 h-9 grid place-items-center rounded-md bg-transparent ring-1 ring-white/15 hover:bg-white/5" href="#" aria-label="Facebook">f</a>
            <a className="w-9 h-9 grid place-items-center rounded-md bg-transparent ring-1 ring-white/15 hover:bg.white/5" href="#" aria-label="Instagram">◎</a>
          </div>
        </div>

        <div className="lg:justify-self-end text-center lg:text-left">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="flex items-stretch w-full max-w-[360px] mx-auto lg:mx-0">
            <input type="email" placeholder="Email address..." className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none w-0 min-w-0"/>
            <button type="submit" className="px-4 rounded-r-md bg-[var(--joyzze-teal)] text-black text-sm font-semibold whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-8 md:pb-10">
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          <div className="text-sm text-white/80">© {new Date().getFullYear()} Joyzze. All rights reserved. | Sitemap</div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[15px]">
            <span className="text-[var(--joyzze-teal)] font-semibold">SERIES</span>
            <a href="https://joyzze.com/a-series/" className="hover:underline">A-SERIES</a>
            <a href="https://joyzze.com/c-series/" className="hover:underline">C-SERIES</a>
            <a href="https://joyzze.com/d-series/" className="hover:underline">D-SERIES</a>
            <a href="https://joyzze.com/m-series/" className="hover:underline">M-SERIES</a>
            <a href="https://joyzze.com/all-products/" className="hover:underline">View All</a>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 opacity-90 text-xs">
          <span className="px-2 py-1 rounded bg-white/10">AMEX</span>
          <span className="px-2 py-1 rounded bg.white/10">Discover</span>
          <span className="px-2 py-1 rounded bg-white/10">PayPal</span>
          <span className="px-2 py-1 rounded bg-white/10">VISA</span>
          <span className="px-2 py-1 rounded bg-white/10">MasterCard</span>
        </div>
      </div>

      <div className="bg-black/80 text-white text-xs px-4 py-2 text-center">Manage Website Data Collection Preferences</div>
    </footer>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Page(){
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('joyzze-theme') : null;
    const initial = saved || 'light';
    setTheme(initial);
    if (initial === 'dark') document.documentElement.classList.add('theme-dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('joyzze-theme', next);
    document.documentElement.classList.toggle('theme-dark', next === 'dark');
  };

  return (
    <main>
      <SigninHeader theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <SigninFooter />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

        :root {
          --joyzze-teal: #1CD2C1;
          --header-bg: #e9edf3;
          --header-text: #0f0f0f;
          --nav-bg: #2f2f2f;     /* dark navbar */
          --nav-text: #d7d7d7;
        }
        .theme-dark {
          --header-bg: #1c1f26;
          --header-text: #ffffff;
          --nav-bg: #111318;
          --nav-text: #d7d7d7;
        }

        html, body { 
          font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; 
          overflow-x: hidden;
        }

        :root{
          --app-bg: #ffffff;
          --app-surface: #ffffff;
          --app-muted: #475569;
          --app-border: rgba(0,0,0,.08);
        }
        .theme-dark{
          --app-bg: #0f1115;
          --app-surface: #181a1f;
          --app-muted: rgba(229,231,235,.75);
          --app-border: rgba(255,255,255,.12);
        }

        body{ background: var(--app-bg); color:#0f1115; }
        .theme-dark body{ color:#e5e7eb; }

        .btn { 
          display:inline-flex; 
          gap:.5rem; 
          align-items:center; 
          padding:.55rem .9rem; 
          border-radius:.6rem; 
          border:1px solid transparent;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          text-decoration: none;
          cursor: pointer;
        }
        .btn-primary { 
          background:var(--joyzze-teal); 
          color:#0b0b0b;
          font-weight: 600;
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .btn-ghost { 
          background:transparent; 
          border:1px solid var(--app-border); 
          color:inherit;
        }
        .btn-ghost:hover {
          background: rgba(0,0,0,0.05);
        }
        .card { 
          background:var(--app-surface); 
          border-radius:1rem; 
          box-shadow:0 1px 0 var(--app-border), 0 1px 2px var(--app-border);
          transition: box-shadow 0.2s ease;
        }
        .card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* NAV + MEGA */
        .nav-dark{
          background: var(--nav-bg);
          color: var(--nav-text);
          border-top:1px solid rgba(0,0,0,.12);
          position:relative;
          z-index: 1500;
          overflow:visible;
        }
        .jz-nav { 
          font-weight:600; 
          font-size:15px; 
          letter-spacing:.01em; 
          flex-wrap: wrap;
        }
        .jz-item { 
          padding:14px 12px; 
          position:relative; 
          line-height:1; 
          color: var(--nav-text); 
          text-decoration:none; 
          border-radius:6px 6px 0 0; 
          display:inline-flex; 
          align-items:center; 
          gap:6px;
          white-space: nowrap;
        }
        .jz-item:hover { 
          color:#00e1c9; 
          background: linear-gradient(#f2f5f5,#eef6f6); 
        }
        .caret { 
          opacity:.75; 
          transition:transform .18s ease, opacity .18s ease; 
        }
        .jz-item:hover .caret,
        .jz-item.jz-active .caret { 
          transform:translateY(1px) rotate(180deg); 
          opacity:1; 
        }

        .jz-underline { 
          position:absolute; 
          left:0; 
          right:0; 
          bottom:-1px; 
          height:2px; 
          background:var(--joyzze-teal); 
          opacity:0; 
          transition:opacity .18s ease; 
        }
        .jz-pointer { 
          position:absolute; 
          left:50%; 
          transform:translateX(-50%); 
          bottom:-6px; 
          width:0; 
          height:0; 
          border-left:6px solid transparent; 
          border-right:6px solid transparent; 
          border-top:6px solid var(--joyzze-teal); 
          opacity:0; 
          transition:opacity .18s ease; 
        }
        .jz-item:hover .jz-underline, 
        .jz-item.jz-active .jz-underline,
        .jz-item:hover .jz-pointer,   
        .jz-item.jz-active .jz-pointer { 
          opacity:1; 
        }

        .jz-mega {
          position: relative;
          border: 1px solid rgba(28,210,193,.85);
          border-top-width: 3px;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(1px);
          box-shadow: 0 32px 64px -20px rgba(0,0,0,.35), 0 12px 24px rgba(0,0,0,.12);
          border-radius: 2px;
          overflow: hidden;
          z-index: 3000;
        }
        .jz-mega-bg { 
          position:absolute; 
          inset:0; 
          background-image: radial-gradient(1000px 440px at 75% 18%, rgba(0,0,0,.08), transparent 60%); 
          opacity:.14; 
          pointer-events:none; 
          border-radius:2px; 
        }
        .jz-sec-title { 
          margin-bottom:12px; 
          color:#2f2f2f; 
          font-weight:700; 
          text-transform:uppercase; 
          letter-spacing:.06em; 
          font-size:14px; 
        }
        .jz-list { 
          list-style:none; 
          padding:0; 
          margin:0; 
        }
        .jz-list li { 
          padding:9px 0; 
          border-bottom:1px solid rgba(0,0,0,.06); 
        }
        .jz-list li:last-child { 
          border-bottom:0; 
        }
        .jz-list a { 
          color:#3f3f3f; 
          font-size:15px; 
          text-decoration:none;
          transition: color 0.2s ease;
        }
        .jz-list a:hover {
          color: var(--joyzze-teal);
        }

        /* Mobile Navigation */
        .mobile-nav-item {
          display: block;
          padding: 12px 16px;
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          font-size: 16px;
          transition: background-color 0.2s ease;
        }
        .mobile-nav-item:hover {
          background-color: rgba(0,0,0,0.05);
        }
        .theme-dark .mobile-nav-item {
          border-bottom-color: rgba(255,255,255,0.1);
        }
        .theme-dark .mobile-nav-item:hover {
          background-color: rgba(255,255,255,0.05);
        }

        /* Search / toggle (theme aware) */
        .jz-input { 
          background:#ffffff; 
          color:#0f0f0f; 
          border:0;
          font-size: 14px;
        }
        .search-btn { 
          background:#ffffff; 
          border:1px solid rgba(0,0,0,.15); 
        }
        .search-plus { 
          color:#0f0f0f; 
          opacity:.85; 
        }
        .theme-dark .jz-input { 
          background: var(--app-surface); 
          color:#e5e7eb; 
          border:1px solid var(--app-border); 
        }
        .theme-dark .search-btn { 
          background: var(--app-surface); 
          border:1px solid var(--app-border); 
          color:#e5e7eb; 
        }
        .theme-dark .search-plus { 
          color:#e5e7eb; 
          opacity:.8; 
        }
        .theme-dark .theme-toggle { 
          background: var(--app-surface) !important; 
          border:1px solid var(--app-border) !important; 
          color:#e5e7eb; 
        }
        .icon-btn {
          display: grid;
          place-items: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .icon-btn:hover{ 
          background: rgba(0,0,0,0.05); 
        }
        .theme-dark .icon-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        /* Dark consistency for inner app */
        .theme-dark .bg-white,
        .theme-dark .bg-slate-50,
        .theme-dark .bg-slate-50\\/60 { 
          background: var(--app-surface) !important; 
        }

        .theme-dark .border-slate-300,
        .theme-dark .ring-slate-200,
        .theme-dark .ring-black\\/10 { 
          border-color: var(--app-border) !important; 
          box-shadow: 0 0 0 1px var(--app-border) inset !important; 
        }

        .theme-dark .text-slate-600{ 
          color: var(--app-muted) !important; 
        }
        .theme-dark #app .border-dashed{ 
          border-color: var(--app-border) !important; 
        }
        .theme-dark #app .rounded-2xl.overflow-hidden{ 
          background: var(--app-surface) !important; 
        }

        /* Ensure content below can't cover header area */
        header + * { 
          position: relative; 
          z-index: 1; 
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .jz-item {
            padding: 10px 8px;
            font-size: 14px;
          }
          
          .jz-mega {
            width: 95vw;
            left: 2.5vw;
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .jz-nav {
            justify-content: center;
          }
          
          .jz-mega .grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 1rem !important;
          }
        }

        @media (max-width: 1280px){ 
          .jz-input { 
            width: 180px; 
          } 
        }
        @media (max-width: 1100px){ 
          .jz-input { 
            width: 160px; 
          } 
        }
        @media (max-width: 980px){ 
          .jz-input { 
            display:none; 
          } 
        }

        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
