'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------- Icons ---------------- */
const Icon = {
  Upload: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Wand: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Reset: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Download: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Phone: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Search: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/><path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>),
  Plus: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>),
  Shuffle: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p} style={{transform:'rotate(-8deg)'}}><path d="M3 6h4l4 6 4 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M17 6h4l-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M11 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  User: (p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  CaretDown:(p)=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>),
  Bag:(p)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Truck:(p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 6h10v8H3zM13 10h4l4 4v4h-4M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  Return:(p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M20 18a8 8 0 1 0-3.1-15.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>),
  Card:(p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.6"/></svg>),
  Lock:(p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.7"/></svg>),
  Sun:(p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  Moon:(p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M21 12.3A8.5 8.5 0 1 1 11.7 3 7 7 0 0 0 21 12.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

/* ---------------- UI helpers ---------------- */
const Button = ({ className="", disabled, onClick, children, type="button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className="", children }) => (
  <div className={`card ${className}`}>{children}</div>
);

/* ---------------- Compare slider ---------------- */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onDown = (e) => {
      const rect = el.getBoundingClientRect();
      const move = (clientX) => {
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        setPos(Math.round((x / rect.width) * 100));
      };
      const onMove = (ev) => move(ev.touches ? ev.touches[0].clientX : ev.clientX);
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    };
    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 select-none">
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false}/>
      <img
        src={beforeSrc}
        alt="Before"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      <div className="absolute top-0 bottom-0 w-[2px] bg-indigo-500" style={{ left: `${pos}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -ml-4" style={{ left: `${pos}%` }}>
        <div className="h-10 w-10 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur border border-black/10 dark:border-white/10 shadow flex items-center justify-center">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
            <span className="inline-block -ml-[2px]">&lsaquo;</span>
            <span className="inline-block -mr-[2px]">&rsaquo;</span>
          </div>
        </div>
      </div>
      <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full bg-black/60 text-white">Before</span>
      <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-600/90 text-white">After</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e)=>setPos(Number(e.target.value))}
        className="absolute left-0 right-0 bottom-2 w-[98%] mx-auto accent-indigo-500"
        aria-label="Compare before and after"
      />
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function pickResultUrl(data){
  if (data && typeof data === "object") {
    if (typeof data.image === "string" && data.image.length) {
      return data.image.indexOf("data:")===0 ? data.image : `data:image/png;base64,${data.image}`;
    }
    if (typeof data.url === "string" && data.url.length) return data.url;
  }
  return null;
}
function validateImageFile(f,maxMB){
  const MAX = typeof maxMB==="number" ? maxMB : 12;
  if (!f || typeof f!=="object") return "Invalid file.";
  const type = String(f.type||"");
  const size = Number(f.size||0);
  if (type.indexOf("image/")!==0) return "Please upload an image file.";
  if (size > MAX*1024*1024) return `Image too large. Please keep it under ${MAX}MB.`;
  return null;
}
async function safeReadText(res){ try{return await res.text();}catch(e){return "";} }
function readImageSize(url){
  return new Promise((resolve,reject)=>{ const img=new Image(); img.onload=()=>resolve({w: img.naturalWidth, h: img.naturalHeight}); img.onerror=reject; img.src=url; });
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
  const controllerRef=useRef(null);

  const [panelH, setPanelH] = useState(560);
  const ACTION_H = 56;

  useEffect(() => {
    const setH = () => setPanelH(Math.round(Math.max(480, Math.min(760, window.innerHeight * 0.68))));
    setH(); window.addEventListener('resize', setH);
    return () => window.removeEventListener('resize', setH);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (resultUrl && resultUrl.startsWith && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
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

  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setResultUrl(null); setProgress(0); setError(null); };

  const groom=async()=>{
    if(!file) return;
    setLoading(true); setError(null); setProgress(12);
    controllerRef.current=new AbortController();
    try{
      const form=new FormData();
      form.append("image",file);
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
        if (imgW && imgH && (w !== imgW || h !== imgH)) {
          const padded = await padToSize(url, imgW, imgH);
          setResultUrl(padded);
        } else {
          setResultUrl(url);
        }
      } catch { setResultUrl(url); }
      setProgress(100);
    }catch(e){ setError(e?.message||"Something went wrong."); }
    finally{ setLoading(false); }
  };

  const cancel=()=>{ controllerRef.current?.abort(); setLoading(false); };

  return (
    <section id="app" className="container mx-auto px-6 py-16">
      {/* Title bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-emerald-500">Joyzze – Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">Upload → AI groom → compare before &amp; after</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-primary" href={resultUrl} download><Icon.Download /> Download</a>
        ) : <div className="h-9" />}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Upload */}
        <Card className="p-4">
          <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Upload</div>
          {!previewUrl && error && (
            <div className="mb-4 rounded-xl px-4 py-3 bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30">{String(error)}</div>
          )}
          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border border-dashed border-slate-300/80 dark:border-white/15 text-center cursor-pointer bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 backdrop-blur transition-colors" style={{ height: panelH }}>
              <div className="grid place-items-center gap-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white dark:bg-white/10 grid place-items-center shadow ring-1 ring-black/5 dark:ring-white/10"><Icon.Upload /></div>
                <div className="font-medium">Drag &amp; drop or click to upload</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">PNG, JPG up to 12MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile} />
            </label>
          ) : (
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/40 ring-1 ring-black/5 dark:ring-white/10" style={{ height: panelH }}>
                <img src={previewUrl} alt="Uploaded" className="h-full w-full object-contain" />
              </div>
              <div className="mt-3 h-14 flex flex-wrap items-center gap-3">
                {!loading ? (
                  <>
                    <Button className="btn-primary" onClick={groom}><Icon.Wand /> Groom</Button>
                    <Button className="btn-ghost" onClick={resetAll}><Icon.Reset /> Reset</Button>
                  </>
                ) : (
                  <>
                    <Button className="btn-primary" disabled><Icon.Wand /> Working… {progress}%</Button>
                    <Button className="btn-ghost" onClick={cancel}><Icon.Reset /> Cancel</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Right: Result + Slider */}
        <Card className="p-4">
          <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Result</div>
          <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300/80 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/30 text-sm text-slate-600 dark:text-slate-400 px-6 text-center">
                Your groomed image will appear here. After processing, drag the handle to compare before/after.
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
   Header (with REAL URLs + close-on-click)
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

  const LinkItem = ({ href, children }) => (
    <a href={href} onClick={close}>{children}</a>
  );

  const NavItem = ({ id, href, children }) => {
    const active = open === id;
    return (
      <a
        href={href}
        className={`jz-item ${active ? 'text-white jz-active' : ''}`}
        onMouseEnter={() => setOpen(id)}
        onFocus={() => setOpen(id)}
        onClick={close}
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

  const topBarClass = theme === 'light' ? 'bg-[#e9ecef]' : 'bg-[#1c1f26]';
  const iconBtn = 'icon-btn grid place-items-center w-9 h-9 rounded-md hover:bg-black/5 dark:hover:bg-white/10';

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur supports-backdrop-blur:bg-white/60 dark:supports-backdrop-blur:bg-black/20">
      {/* single row */}
      <div className={topBarClass}>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-[70px] grid grid-cols-[1fr_auto_1fr] items-center">
          <a href="tel:(877) 456-9993" className="justify-self-start hidden sm:flex items-center gap-2 text-[#0f0f0f] dark:text-white">
            <Icon.Phone className="opacity-85" />
            <span className="text-[14px] font-semibold tracking-[.01em]">(877) 456-9993</span>
          </a>

          <a href="/" className="justify-self-center block rounded-[10px] overflow-hidden shadow-[0_12px_26px_rgba(0,0,0,.25)]" aria-label="Joyzze">
            <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] px-6 py-2.5 rounded-[10px]">
              <span className="text-white text-[22px] font-semibold tracking-[0.25em]">JOYZZE</span>
            </div>
          </a>

          <div className="justify-self-end flex items-center gap-3 sm:gap-4">
            <div className="relative hidden md:block">
              <form action="/search" method="get">
                <input
                  type="text" name="q" placeholder="Search…" autoComplete="off"
                  className="jz-input h-[42px] w-[220px] rounded-md bg-white dark:bg-white/10 pl-4 pr-[58px] text-[14px] italic placeholder:italic placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none ring-1 ring-black/10 dark:ring-white/10"
                />
              </form>
              <Icon.Plus className="absolute right-[56px] top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300 pointer-events-none" />
              <button className="absolute right-[8px] top-1/2 -translate-y-1/2 h-[32px] w-[32px] grid place-items-center rounded-full bg-white dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/15" aria-label="Search">
                <Icon.Search />
              </button>
            </div>

            <a className={`hidden sm:grid ${iconBtn}`} href="/compare" aria-label="Compare"><Icon.Shuffle /></a>
            <div className="hidden sm:flex items-center">
              <a className={`${iconBtn}`} href="/account" aria-label="Account"><Icon.User /></a>
              <Icon.CaretDown className="ml-[2px] opacity-80" />
            </div>
            <a className={`${iconBtn}`} href="/cart" aria-label="Cart"><Icon.Bag /></a>

            <button
              onClick={onToggleTheme}
              className="icon-btn h-9 px-2 rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'light' ? <Icon.Sun/> : <Icon.Moon/>}
            </button>
          </div>
        </div>
      </div>

      {/* dark navbar + centered mega panel */}
      <nav className="bg-[#2f2f2f] text-[#d7d7d7] border-t border-black/10" onMouseLeave={close}>
        <div className="max-w-[1280px] mx-auto px-2 lg:px-4 relative">
          <div className="flex items-center">
            <div className="px-4 text-[22px] text-emerald-400 select-none leading-[1]">ʝ</div>
            <div className="jz-nav flex items-stretch gap-[2px]">
              <NavItem id="all" href="https://joyzze.com/all-products/">All Products</NavItem>
              <NavItem id="clippers" href="https://joyzze.com/clippers/">Clippers</NavItem>
              <NavItem id="blades" href="https://joyzze.com/blades/">Blades</NavItem>
              <NavItem id="combs" href="https://joyzze.com/combs-accessories/">Combs &amp; Accessories</NavItem>
              <NavItem id="info" href="https://joyzze.com/information/">Information</NavItem>
              <a href="https://joyzze.com/recycling-sharpening/" className="jz-item" onClick={close}>Recycling &amp; Sharpening</a>
              <a href="https://joyzze.com/distributor/" className="jz-item" onClick={close}>Distributor</a>
            </div>
          </div>

          {open && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[8px]" onMouseEnter={()=>setOpen(open)}>
              <div className="jz-mega w-[calc(100vw-32px)] max-w-[1280px]">
                <div className="jz-mega-bg" />
                <div className="relative grid grid-cols-3 gap-14 p-8">
                  {open === 'all' && (
                    <>
                      <MegaSection title="CLIPPERS">
                        <li><LinkItem href="https://joyzze.com/raptor-falcon-a5-clippers/">Raptor &amp; Falcon | A-Series</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/hornet/">Hornet | C-Series</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/stinger/">Stinger | C-Series</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/piranha/">Piranha | D-Series</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/hornet-mini/">Hornet Mini | M-Series</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="BLADES">
                        <li><LinkItem href="https://joyzze.com/a-series-raptor/">A-Series | Raptor &amp; Falcon</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/a-series-raptor-falcon-wide/">A-Series | Wide</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/c-series-hornet-stinger-blades-all/">C-Series | 5-in-1</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/d-series-piranha/">D-Series | Piranha</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/m-series-hornet-mini/">M-Series | Mini</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="COMBS & ACCESSORIES">
                        <li><LinkItem href="https://joyzze.com/cases-all-products/">Cases</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/joyzze-combs/">Combs</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/blade-scissor-oil-all-products/">Blade &amp; Scissor Oil</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/multi-functional-tool-bag/">Multi-Functional Tool Bag</LinkItem></li>
                      </MegaSection>
                    </>
                  )}

                  {open === 'clippers' && (
                    <>
                      <MegaSection title="5-IN-1 CLIPPERS | C-SERIES">
                        <li><LinkItem href="https://joyzze.com/hornet-clippers-5-in-1/">Hornet</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/stinger-clippers-5-in-1/">Stinger</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="A5 STYLE | A-SERIES">
                        <li><LinkItem href="https://joyzze.com/falcon/">Falcon</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/raptor-clippers/">Raptor</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="D-SERIES">
                        <li><LinkItem href="https://joyzze.com/piranha-clippers/">Piranha</LinkItem></li>
                        <li className="mt-2" />
                        <li className="jz-sec-title !mb-2">PARTS</li>
                        <li><LinkItem href="https://joyzze.com/a5-falcon/">A5 Falcon</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/a5-raptor/">A5 Raptor</LinkItem></li>
                      </MegaSection>
                    </>
                  )}

                  {open === 'blades' && (
                    <>
                      <MegaSection title="A-SERIES | A5 STYLE"><li><LinkItem href="https://joyzze.com/a5-blades/">A5 Blades</LinkItem></li></MegaSection>
                      <MegaSection title="A-SERIES WIDE | A5">
                        <li><LinkItem href="https://joyzze.com/wide-blades-a-series/">Wide Blades</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/joyzze-bundle-plus/">Bundle Plus</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/joyzze-bundle/">Bundle</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="C-SERIES | 5-IN-1"><li><LinkItem href="https://joyzze.com/c-max-blades/">C-MAX Blades</LinkItem></li></MegaSection>
                    </>
                  )}

                  {open === 'combs' && (
                    <>
                      <MegaSection title="A-SERIES | WIDE COMBS">
                        <li><LinkItem href="https://joyzze.com/a-series-wide-metal-combs/">Wide Metal Combs</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/bundle/">Bundle</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/bundle-plus/">Bundle Plus</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="A & D SERIES">
                        <li><LinkItem href="https://joyzze.com/a-d-series-8-piece-metal-comb-set/">8 Piece Metal Comb Set</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="CASES">
                        <li><LinkItem href="https://joyzze.com/12-slot/">12-Slot</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/22-slot/">22-Slot</LinkItem></li>
                      </MegaSection>
                    </>
                  )}

                  {open === 'info' && (
                    <>
                      <MegaSection title="ABOUT">
                        <li><LinkItem href="https://joyzze.com/information/about-joyzze/">About JOYZZE™</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/information/faqs/">FAQs</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/joyzze-privacy-policy/">Privacy Policy</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="SUPPORT">
                        <li><LinkItem href="https://joyzze.com/information/contact/">Contact</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/information/shipping-returns/">Shipping &amp; Returns</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/accessibility-statement/">Accessibility</LinkItem></li>
                      </MegaSection>
                      <MegaSection title="DOCS">
                        <li><LinkItem href="https://joyzze.com/clipper-repair-form-joyzze/">Clipper Repair Form</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/warranty-joyzze/">Warranty</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/joyzze-product-brochure/">Product Brochure</LinkItem></li>
                        <li><LinkItem href="https://joyzze.com/information/terms-conditions/">Terms &amp; Conditions</LinkItem></li>
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

/* =========================================================
   Hero / How / Samples
   ========================================================= */
function Hero(){
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-5">Joyzze</div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-emerald-400">with AI</span>
          </h1>
          <p className="mt-4 text-slate-200/90 max-w-xl">
            Upload a photo; we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="btn btn-primary">Try it free</a>
            <a href="#how" className="btn text-white border border-white/20 bg-white/5 hover:bg-white/10">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img src="/dog-10.png" alt="Hero sample" className="w-full h-auto object-cover" />
        </div>
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="container mx-auto px-6 py-14">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Upload → AI groom → compare before &amp; after</p>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[200px]">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center text-xs mb-3">1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">PNG or JPG up to ~12MB.</p>
          <div className="mt-auto pt-4"><a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">Upload now</a></div>
        </Card>
        <Card className="p-6 flex flex-col min-h-[200px]">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center text-xs mb-3">2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">We tidy fur around face and paws for a neat look.</p>
          <div className="mt-auto pt-4"><a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">Start grooming</a></div>
        </Card>
        <Card className="p-6 flex flex-col min-h-[200px]">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center text-xs mb-3">3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Drag the slider to see the difference.</p>
          <div className="mt-auto pt-4"><a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">Try the slider</a></div>
        </Card>
      </div>
    </section>
  );
}

function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-14">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Background, pose, and lighting stay identical—only grooming changes.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-white/10"><img src="/dog-1.jpg" alt="Sample 1" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-white/10"><img src="/dog-2.jpg" alt="Sample 2" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-white/10"><img src="/dog-3.jpg" alt="Sample 3" className="w-full h-auto object-cover" /></div>
      </div>
    </section>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function FooterPromoRibbon(){
  return (
    <div className="bg-slate-900 text-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-6 text-[13px]">
        <div className="flex items-center gap-3"><Icon.Truck className="text-emerald-400" /><span>Free Shipping over $350</span></div>
        <div className="flex items-center gap-3"><Icon.Return className="text-emerald-400" /><span>Hassle Free Returns</span></div>
        <div className="flex items-center gap-3"><Icon.Card className="text-emerald-400" /><span>All Major Cards</span></div>
        <div className="flex items-center gap-3"><Icon.Lock className="text-emerald-400" /><span>Secure Checkout</span></div>
      </div>
    </div>
  );
}

function SigninFooter() {
  return (
    <footer className="bg-slate-800 text-slate-100">
      <FooterPromoRibbon />
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div>
          <h4 className="text-emerald-400 tracking-wide text-lg mb-4">LINKS</h4>
          <ul className="space-y-2 text-[15px] text-slate-200/90">
            <li><a href="https://joyzze.com/all-products/" className="hover:underline">All Products</a></li>
            <li><a href="https://joyzze.com/clippers/" className="hover:underline">Clippers</a></li>
            <li><a href="https://joyzze.com/blades/" className="hover:underline">Blades</a></li>
            <li><a href="https://joyzze.com/combs-accessories/" className="hover:underline">Combs &amp; Accessories</a></li>
            <li><a href="https://joyzze.com/information/" className="hover:underline">Information</a></li>
          </ul>
        </div>
        <div className="text-center">
          <div className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] rounded-lg px-7 py-3 shadow">
            <span className="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>
          </div>
          <p className="mt-3 text-sm text-white/80">Joy of Grooming Made Easy™</p>
          <div className="mt-6 space-y-1 text-[15px] text-slate-100">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com" className="hover:underline">info@joyzze.com</a></div>
          </div>
        </div>
        <div className="lg:justify-self-end">
          <h4 className="text-emerald-400 tracking-wide text-lg mb-4">SUBSCRIBE</h4>
          <form className="flex items-stretch w-full max-w-[360px]">
            <input type="email" placeholder="Email address..." className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none"/>
            <button type="submit" className="px-4 rounded-r-md bg-emerald-400 text-black text-sm font-semibold">✉</button>
          </form>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 pb-10">
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-white/80">© {new Date().getFullYear()} Joyzze. All rights reserved.</div>
          <div className="flex items-center gap-4 opacity-90 text-xs">
            <span className="px-2 py-1 rounded bg-white/10">AMEX</span>
            <span className="px-2 py-1 rounded bg-white/10">Discover</span>
            <span className="px-2 py-1 rounded bg-white/10">PayPal</span>
            <span className="px-2 py-1 rounded bg-white/10">VISA</span>
            <span className="px-2 py-1 rounded bg-white/10">MasterCard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   Page
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

      {/* Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
        :root { --joyzze-teal: #10b981; }
        html, body { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; }
        :root{
          --app-bg: #ffffff;
          --app-surface: rgba(255,255,255,.85);
          --app-muted: #475569;
          --app-border: rgba(0,0,0,.08);
        }
        .theme-dark{
          --app-bg: #0f1115;
          --app-surface: #141821;
          --app-muted: rgba(229,231,235,.78);
          --app-border: rgba(255,255,255,.12);
        }
        body{ background: var(--app-bg); }
        .theme-dark body{ color:#e5e7eb; }

        .btn { display:inline-flex; gap:.5rem; align-items:center; padding:.55rem .9rem; border-radius:.65rem; transition:all .15s ease; }
        .btn-primary { background:var(--joyzze-teal); color:#0b0b0b; }
        .btn-primary:hover { filter:brightness(.95); }
        .btn-ghost { background:transparent; border:1px solid var(--app-border); color:inherit; }
        .card { background:var(--app-surface); border-radius:1.05rem; box-shadow:0 1px 0 var(--app-border), 0 10px 25px rgba(0,0,0,.05); backdrop-filter: blur(6px); }

        .jz-nav, .jz-item, .jz-mega, .jz-sec-title, .jz-list, .jz-input { font-family: inherit; }
        .jz-nav { font-weight:600; font-size:15px; letter-spacing:.01em; }
        .jz-item { padding:14px 20px; position:relative; line-height:1; color:#d7d7d7; text-decoration:none; }
        .jz-item:hover { color:#34d399; }
        .caret { margin-left:6px; opacity:.75; transition:transform .18s ease, opacity .18s ease; }
        .jz-item.jz-active .caret, .jz-item:hover .caret { transform:translateY(1px) rotate(180deg); opacity:1; }
        .jz-underline { position:absolute; left:0; right:0; bottom:-1px; height:2px; background:#34d399; opacity:0; transition:opacity .18s ease; }
        .jz-pointer { position:absolute; left:50%; transform:translateX(-50%); bottom:-6px; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid #34d399; opacity:0; transition:opacity .18s ease; }
        .jz-item.jz-active .jz-underline, .jz-item:hover .jz-underline,
        .jz-item.jz-active .jz-pointer,   .jz-item:hover .jz-pointer { opacity:1; }

        .jz-mega {
          position: relative;
          border: 1px solid rgba(52,211,153,.65);
          border-top-width: 3px;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(3px);
          box-shadow: 0 32px 64px -20px rgba(0,0,0,.35), 0 12px 24px rgba(0,0,0,.12);
          border-radius: 10px;
          overflow: hidden;
          z-index: 60;
        }
        .jz-mega-bg {
          position:absolute; inset:0;
          background-image: radial-gradient(900px 380px at 70% 18%, rgba(0,0,0,.08), transparent 60%);
          opacity:.18; pointer-events:none;
        }
        .jz-sec-title { margin-bottom:12px; color:#2f2f2f; font-weight:700; text-transform:uppercase; letter-spacing:.06em; font-size:13px; }
        .jz-list { list-style:none; padding:0; margin:0; }
        .jz-list li { padding:9px 0; border-bottom:1px solid rgba(0,0,0,.06); }
        .jz-list li:last-child { border-bottom:0; }
        .jz-list a { color:#3f3f3f; font-size:15px; }
        .jz-list a:hover { color:#111; text-decoration:none; }

        .jz-input{ background:var(--app-surface); color:inherit; border:1px solid var(--app-border); }
        .jz-input:focus { box-shadow: 0 0 0 3px rgba(16,185,129,.16); }

        .theme-dark .bg-white,
        .theme-dark .bg-slate-50,
        .theme-dark .bg-slate-50\\/60 { background: var(--app-surface) !important; }
        .theme-dark .border-slate-300,
        .theme-dark .ring-slate-200,
        .theme-dark .ring-black\\/10 { border-color: var(--app-border) !important; box-shadow: 0 0 0 1px var(--app-border) inset !important; }
        .theme-dark .text-slate-600{ color: var(--app-muted) !important; }
        .theme-dark #app .border-dashed{ border-color: var(--app-border) !important; }
        .theme-dark #app .rounded-2xl.overflow-hidden{ background: var(--app-surface) !important; }
        .icon-btn{ color: inherit; }
        .theme-dark .icon-btn:hover{ background: rgba(255,255,255,.08) !important; }
        .theme-dark input::placeholder{ color: rgba(255,255,255,.55); }

        @media (max-width: 1280px){ .jz-input { width: 520px !important; } }
        @media (max-width: 1100px){ .jz-input { width: 420px !important; } }
        @media (max-width: 980px){ .jz-input { display:none; } }
      `}</style>
    </main>
  );
}
