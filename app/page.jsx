'use client';

import React, { useEffect, useRef, useState } from 'react';

/* =============================================================================
   ICONS
   ============================================================================= */
const Icon = {
  Phone: (p: any) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
  Upload: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Wand: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Reset: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Download: (p: any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

/* =============================================================================
   SHARED HEADER (same as auth)
   ============================================================================= */
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 right-0 h-full w-[88%] max-w-[360px] bg-[var(--surface)] text-[var(--fg)] shadow-2xl transition-transform duration-300 z-[1002] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="text-sm font-semibold">Menu</div>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-md hover:bg-[var(--muted-bg)]" aria-label="Close menu">
            <Icon.Close />
          </button>
        </div>
        <nav className="p-3 text-[15px]">
          {[
            ['All Products','https://joyzze.com/all-products/'],
            ['Clippers','https://joyzze.com/clippers/'],
            ['Blades','https://joyzze.com/blades/'],
            ['Combs & Accessories','https://joyzze.com/combs-accessories/'],
            ['Information','https://joyzze.com/information/'],
            ['Recycling & Sharpening','https://joyzze.com/recycling-sharpening/'],
            ['Distributor','https://joyzze.com/distributor/'],
          ].map(([label,href])=>(
            <a key={label} className="mob-link" href={href}>{label}</a>
          ))}
        </nav>
      </aside>
    </>
  );
}

function SiteHeader() {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('joyzze-theme') as 'light'|'dark'|null) : null;
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
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-4 h-[64px]">
          {/* Left */}
          <a href="tel:(877) 456-9993" className="justify-self-start flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold">
            <Icon.Phone className="opacity-85" />
            <span className="tracking-[.01em]">(877) 456-9993</span>
          </a>
          {/* Center */}
          <a href="/" className="justify-self-center block rounded-[10px] overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,.35)]" aria-label="Joyzze">
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
          {/* Right */}
          <div className="justify-self-end flex items-center gap-1 sm:gap-2">
            <button onClick={toggleTheme} className="h-9 px-2 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted-bg)] inline-flex items-center gap-2" aria-label="Toggle theme">
              {theme === 'dark' ? <Icon.Moon /> : <Icon.Sun />}
              <span className="hidden sm:inline text-[13px]">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            <a className="hidden md:grid place-items-center w-9 h-9 rounded-md hover:bg-[var(--muted-bg)]" href="/account.php" aria-label="Account"><Icon.User /></a>
            <a className="hidden md:grid place-items-center w-9 h-9 rounded-md hover:bg-[var(--muted-bg)]" href="/cart.php" aria-label="Cart"><Icon.Bag /></a>
            <button className="grid md:hidden place-items-center w-9 h-9 rounded-md hover:bg-[var(--muted-bg)]" onClick={()=>setOpen(true)} aria-label="Open menu">
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
      <Drawer open={open} onClose={()=>setOpen(false)} />
    </>
  );
}

/* =============================================================================
   SMALL UI
   ============================================================================= */
const Button = ({ className = "", disabled, onClick, children, type = "button" }: any) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className="", children }: any) => <div className={`card ${className}`}>{children}</div>;

/* =============================================================================
   UTIL
   ============================================================================= */
function pickResultUrl(data: any){
  if (data && typeof data === "object") {
    if (typeof data.image === "string" && data.image.length) {
      return data.image.indexOf("data:")===0 ? data.image : `data:image/png;base64,${data.image}`;
    }
    if (typeof data.url === "string" && data.url.length) return data.url;
  }
  return null;
}
function validateImageFile(f: any, maxMB=12){
  if (!f || typeof f!=="object") return "Invalid file.";
  const type = String(f.type||"");
  const size = Number(f.size||0);
  if (type.indexOf("image/")!==0) return "Please upload an image file.";
  if (size > maxMB*1024*1024) return `Image too large. Please keep it under ${maxMB}MB.`;
  return null;
}
async function safeReadText(res: Response){ try{return await res.text();}catch{ return ""; } }
function readImageSize(url: string){
  return new Promise<{w:number;h:number}>((resolve,reject)=>{
    const img=new Image();
    img.crossOrigin='anonymous';
    img.onload=()=>resolve({w: img.naturalWidth, h: img.naturalHeight});
    img.onerror=reject;
    img.src=url;
  });
}
async function padToSize(dataUrl: string, targetW: number, targetH: number) {
  const img = new Image(); img.src = dataUrl; await new Promise(r => (img.onload = r));
  const canvas = document.createElement("canvas"); canvas.width = targetW; canvas.height = targetH;
  const ctx = canvas.getContext("2d")!; ctx.clearRect(0,0,targetW,targetH);
  const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
  const nw = Math.round(img.naturalWidth * scale); const nh = Math.round(img.naturalHeight * scale);
  const dx = Math.floor((targetW - nw) / 2); const dy = Math.floor((targetH - nh) / 2);
  ctx.drawImage(img, dx, dy, nw, nh); return canvas.toDataURL("image/png");
}

/* =============================================================================
   COMPARE SLIDER
   ============================================================================= */
function CompareSlider({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string; }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none" style={{ touchAction: 'none' }}>
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false}/>
      <img src={beforeSrc} alt="Before" className="absolute inset-0 h-full w-full object-contain" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false}/>
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(79,70,229,0.9)' }} />
      <div className="absolute bottom-2 left-3 right-3">
        <input aria-label="Compare" type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full"/>
      </div>
    </div>
  );
}

/* =============================================================================
   Upload + Result
   ============================================================================= */
function UploadAndResult(){
  const [file,setFile]=useState<File|null>(null);
  const [previewUrl,setPreviewUrl]=useState<string|null>(null);
  const [resultUrl,setResultUrl]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [progress,setProgress]=useState(0);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [urlText, setUrlText] = useState("");
  const controllerRef=useRef<AbortController|null>(null);

  const [panelH, setPanelH] = useState(520);
  const ACTION_H = 56;

  const leftTopRef = useRef<HTMLDivElement|null>(null);
  const rightTitleRef = useRef<HTMLDivElement|null>(null);
  const [spacerH, setSpacerH] = useState(0);

  useEffect(() => {
    const setH = () => {
      const h = Math.round(Math.max(480, Math.min(760, window.innerHeight * 0.68)));
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
    const ro = new (window as any).ResizeObserver(measure);
    if (leftTopRef.current) ro.observe(leftTopRef.current);
    if (rightTitleRef.current) ro.observe(rightTitleRef.current);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect?.();
    };
  }, [urlText, previewUrl, panelH]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (resultUrl && resultUrl.startsWith && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFile = async (f: File) => {
    setError(null);
    const validationError = validateImageFile(f, 12);
    if (validationError){ setError(validationError); return; }
    const url = URL.createObjectURL(f);
    setFile(f); setResultUrl(null); setPreviewUrl(url);
    try { const { w, h } = await readImageSize(url); setImgW(w); setImgH(h); } catch {}
  };
  const selectFile=(e: React.ChangeEvent<HTMLInputElement>)=>{ const f=e?.target?.files?.[0]; if(f)handleFile(f); };

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
      if (file) form.append("image",file); else form.append("image_url", String(previewUrl));
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
    }catch(e: any){ setError(e?.message||"Something went wrong."); }
    finally{ setLoading(false); }
  };

  const cancel=()=>{ controllerRef.current?.abort(); setLoading(false); };

  const hasInput = !!previewUrl;

  return (
    <section id="app" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-[#00e1c9]">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-[var(--app-muted)]">Upload a dog photo → AI grooms the dog → compare before &amp; after</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-primary" href={resultUrl} download><Icon.Download /> Download</a>
        ) : <div className="h-9" />}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <Card className="p-4">
          <div ref={leftTopRef}>
            <div className="mb-2 text-sm font-semibold invisible">Upload</div>
            <div className="flex items-stretch gap-2 mb-3">
              <input
                type="url"
                value={urlText}
                onChange={(e)=>setUrlText(e.target.value)}
                placeholder="Paste image URL…"
                className="flex-1 min-w-0 px-3 py-2 rounded-md ring-1 ring-[var(--app-border)] bg-[var(--app-surface)] text-inherit outline-none"
              />
              <button className="btn btn-ghost" onClick={handleUrlLoad}>Load</button>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[var(--app-border)] bg-[var(--app-surface)]" style={{ height: panelH, position:'relative' }}>
            <label className="absolute inset-0 grid place-items-center text-center cursor-pointer">
              {!hasInput && (
                <div className="grid place-items-center gap-3 text-[var(--app-muted)]">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--app-surface)] grid place-items-center shadow ring-1 ring-[var(--app-border)]"><Icon.Upload /></div>
                  <div className="font-medium">Drag &amp; drop or click to upload</div>
                  <div className="text-xs">PNG, JPG up to 12MB</div>
                </div>
              )}
              <input aria-label="Upload image" type="file" accept="image/*" className="hidden" onChange={selectFile}/>
            </label>

            {hasInput && (
              <div className="absolute top-3 left-3 flex items-center gap-3 rounded-xl px-2.5 py-2 bg-black/5 dark:bg.white/5 ring-1 ring-[var(--app-border)]">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/10">
                  <img src={previewUrl!} alt="thumb" className="w-full h-full object-cover"/>
                </div>
                <div className="max-w-[220px] text-xs leading-5">
                  <div className="truncate">Selected image</div>
                  <div className="opacity-70 truncate">{file?.name || previewUrl}</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 h-14 flex flex-wrap items-center gap-3">
            {!loading ? (
              <>
                <Button className="btn-primary" onClick={groom}><Icon.Wand /> Groom</Button>
                <Button className="btn-ghost" onClick={resetAll}><Icon.Reset /> Reset</Button>
                {error && <span className="text-red-500 text-sm ml-auto">{String(error)}</span>}
              </>
            ) : (
              <>
                <Button className="btn-primary" disabled><Icon.Wand /> Working… {progress}%</Button>
                <Button className="btn-ghost" onClick={cancel}><Icon.Reset /> Cancel</Button>
              </>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div style={{ height: spacerH }} aria-hidden="true" />
          <div ref={rightTitleRef} className="mb-2 text-sm font-semibold">Groomed dog using hornet</div>
          <div className="rounded-2xl overflow-hidden" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 dark:bg-[var(--app-surface)] dark:border-[var(--app-border)] text-sm text-slate-600 text-center dark:text-[var(--app-muted)]">
                Your groomed image will appear here. After processing, use the slider to compare before/after.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl!} afterSrc={resultUrl} />
            )}
          </div>
          <div style={{ height: ACTION_H }} />
        </Card>
      </div>
    </section>
  );
}

/* =============================================================================
   HERO / HOW / SAMPLES
   ============================================================================= */
function Hero(){
  return (
    <header className="relative overflow-hidden text-white"
      style={{background: 'linear-gradient(135deg,#2a2f36 0%, #22262c 45%, #1a1e24 100%)'}}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">Joyzze</div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-[#00e1c9]">with AI</span>
          </h1>
          <p className="mt-4 text-slate-200/90 max-w-xl">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>. Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="btn btn-primary">Try it free</a>
            <a href="#how" className="btn text-white border border-white/20 bg-[#121a2b]">See how it works</a>
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
    <section id="how" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 dark:text-[var(--app-muted)] mb-10">Upload your photo → AI grooms the dog → compare before &amp; after.</p>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600 dark:text-[var(--app-muted)]">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-[146px] justify-center">Upload now</a>
          </div>
        </Card>

        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600 dark:text-[var(--app-muted)]">We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-[146px] justify-center">Start grooming</a>
          </div>
        </Card>

        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600 dark:text-[var(--app-muted)]">Use the slider to compare before/after. Download the result in one click.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-[146px] justify-center">Try the slider</a>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Samples(){
  return (
    <section id="examples" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 dark:text-[var(--app-muted)] mb-10">Background, breed, pose, lighting and colors stay identical—only grooming changes.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-[var(--app-border)]"><img src="/dog-1.jpg" alt="Sample 1" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-[var(--app-border)]"><img src="/dog-2.jpg" alt="Sample 2" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-[var(--app-border)]"><img src="/dog-3.jpg" alt="Sample 3" className="w-full h-auto object-cover" /></div>
      </div>
    </section>
  );
}

/* =============================================================================
   FOOTER (same as auth)
   ============================================================================= */
function Footer(){
  return (
    <footer className="bg-[#4a4a4a] text-slate-100">
      <div className="bg-[#0e0e0e] text-[#d9d9d9] border-b-2 border-[var(--joyzze-teal)]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[14px]">
          <div className="flex items-center gap-3">🚚 <span>Free Shipping on orders over $350</span></div>
          <div className="flex items-center gap-3">↩ <span>Hassle Free Returns</span></div>
          <div className="flex items-center gap-3">💳 <span>All Major Cards Accepted</span></div>
          <div className="flex items-center gap-3">🔒 <span>100% Safe &amp; Secure Checkout</span></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        <div>
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">LINKS</h4>
          <ul className="space-y-2 text-[15px]">
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

        <div className="lg:justify-self-end">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="flex items-stretch w-full max-w-[360px]" onSubmit={(e)=>e.preventDefault()}>
            <input type="email" placeholder="Email address..." className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none"/>
            <button type="submit" className="px-4 rounded-r-md bg-[var(--joyzze-teal)] text-black text-sm font-semibold">✉</button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-10">
        <div className="border-top border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
   PAGE
   ============================================================================= */
export default function Page(){
  const [theme, setTheme] = useState<'light'|'dark'>('light');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('joyzze-theme') as 'light'|'dark'|null) : null;
    const initial = saved || 'light';
    setTheme(initial);
    document.documentElement.classList.toggle('theme-dark', initial === 'dark');
  }, []);

  return (
    <main>
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

        :root {
          --joyzze-teal:#1CD2C1;
          --header-bg:#e9edf3;
          --header-fg:#0f0f0f;
          --nav-bg:#2f2f2f;
          --nav-fg:#d7d7d7;
          --page-bg:#ffffff;
          --page-fg:#0f0f0f;
          --surface:#ffffff;
          --fg:#0f0f0f;
          --muted-bg:#f1f5f9;
          --border: rgba(15,23,42,.12);

          --app-bg:#ffffff;
          --app-surface:#ffffff;
          --app-muted:#475569;
          --app-border: rgba(15,23,42,.12);
        }
        .theme-dark {
          --header-bg:#1c1f26;
          --header-fg:#ffffff;
          --nav-bg:#111318;
          --nav-fg:#d7d7d7;
          --page-bg:#0f1115;
          --page-fg:#e5e7eb;
          --surface:#181a1f;
          --fg:#e5e7eb;
          --muted-bg:#12161c;
          --border: rgba(255,255,255,.14);

          --app-bg:#0f1115;
          --app-surface:#181a1f;
          --app-muted: rgba(229,231,235,.75);
          --app-border: rgba(255,255,255,.12);
        }

        html, body { font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; background: var(--page-bg); color: var(--page-fg); }
        .btn { display:inline-flex; gap:.5rem; align-items:center; padding:.55rem .9rem; border-radius:.6rem; border:1px solid transparent; }
        .btn-primary { background:var(--joyzze-teal); color:#0b0b0b; }
        .btn-ghost { background:transparent; border:1px solid var(--app-border); color:inherit; }
        .card { background:var(--app-surface); border-radius:1rem; box-shadow:0 1px 0 var(--app-border), 0 1px 2px var(--app-border); }

        .mob-link{ display:block; padding:.75rem .75rem; border-radius:.5rem; border:1px solid var(--border); background:var(--surface); margin-bottom:.5rem; }
        .mob-link:hover{ background:var(--muted-bg); }

        /* keep content above header overflow panes */
        header + * { position: relative; z-index: 1; }
      `}</style>
    </main>
  );
}
