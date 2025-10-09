'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------- Small SVG icons ---------------- */
const Icon = {
  Upload: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Wand: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Reset: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Download: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),

  /* header/footer glyphs */
  Phone: (props)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: (props)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/>
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Plus: (props)=>(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Shuffle: (props)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 6h4l4 6 4 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 6h4l-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M11 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  User: (props)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  CaretDown: (props)=>(
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  ),
  Bag: (props)=>(
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Truck: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 6h10v8H3zM13 10h4l4 4v4h-4M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Return: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M20 18a8 8 0 1 0-3.1-15.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  Card: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Lock: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),
};

/* ---------------- Small UI helpers ---------------- */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className="", children }) => <div className={`card ${className}`}>{children}</div>;

/* ---------------- Compare slider ---------------- */
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

  const [panelH, setPanelH] = useState(640);
  const ACTION_H = 56;

  useEffect(() => {
    const setH = () => {
      const h = Math.round(Math.max(520, Math.min(820, window.innerHeight * 0.72)));
      setPanelH(h);
    };
    setH();
    window.addEventListener('resize', setH);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-[#00e1c9]">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600">Upload a dog photo → AI grooms the dog → compare before &amp; after</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-primary" href={resultUrl} download><Icon.Download /> Download</a>
        ) : <div className="h-9" />}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Upload */}
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold invisible">Upload placeholder</div>
          {!previewUrl && error && (
            <div className="mb-4 rounded-2xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">{String(error)}</div>
          )}
          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border border-dashed border-slate-300 text-center cursor-pointer hover:bg-white" style={{ height: panelH }}>
              <div className="grid place-items-center gap-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white grid place-items-center shadow"><Icon.Upload /></div>
                <div className="font-medium">Drag &amp; drop or click to upload</div>
                <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile} />
            </label>
          ) : (
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden bg-slate-50" style={{ height: panelH }}>
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

        {/* Right: Result */}
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Groomed dog using hornet</div>
          <div className="rounded-2xl overflow-hidden" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 text-sm text-slate-600">
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
   HEADER — grid layout (phone | logo | search+icons)
   ========================================================= */

function MegaSection({ title, children }) {
  return (
    <div>
      <p className="jz-sec-title">{title}</p>
      <ul className="jz-list">{children}</ul>
    </div>
  );
}

function SigninHeader() {
  const [open, setOpen] = useState(null); // 'all' | 'clippers' | 'blades' | 'combs' | 'info' | null
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

  const NavButton = ({ id, children, href = '#' }) => {
    const active = open === id;
    return (
      <a
        href={href}
        className={`jz-item ${active ? 'text-white jz-active' : ''}`}
        onMouseEnter={() => setOpen(id)}
        onFocus={() => setOpen(id)}
      >
        <span>{children}</span>
        <svg className="caret" width="14" height="14" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        <span className="jz-underline" />
        <span className="jz-pointer" />
      </a>
    );
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top row */}
      <div className="bg-[#bdbdbd]">
        <div className="max-w-[1280px] mx-auto h-[88px] grid grid-cols-[1fr_auto_1fr] items-center">
          {/* left: phone */}
          <a href="tel:(877) 456-9993" className="justify-self-start flex items-center gap-2 text-[#0f0f0f] text-[15px]">
            <Icon.Phone className="opacity-85" />
            <span>(877) 456-9993</span>
          </a>

          {/* center: logo pill */}
          <a
            href="https://joyzze.com/"
            className="justify-self-center block rounded-[12px] overflow-hidden shadow-[0_10px_22px_rgba(0,0,0,.35)]"
            aria-label="Joyzze"
          >
            <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0e0e0e] px-6 py-2 rounded-[12px]">
              <img
                src="/joyzze-logo.svg"
                alt="Joyzze"
                className="h-[50px] w-auto align-middle"
                onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-[28px] font-semibold tracking-[0.25em] px-4">JOYZZE</span>';}}
              />
            </div>
          </a>

          {/* right: search + icons */}
          <div className="justify-self-end flex items-center gap-3 md:gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Raptor, c-series, Piranha..."
                className="jz-input h-[44px] w-[560px] max-w-[560px] rounded-md bg-white pl-4 pr-[60px] text-[14px] italic placeholder:italic placeholder:text-[#6b6b6b] outline-none ring-1 ring-black/10"
              />
              <Icon.Plus className="absolute right-[54px] top-1/2 -translate-y-1/2 text-[#0f0f0f]/85 pointer-events-none" />
              <button
                className="absolute right-[6px] top-1/2 -translate-y-1/2 h-[32px] w-[32px] grid place-items-center rounded-full bg-white ring-1 ring-black/15 hover:bg-black/5"
                aria-label="Search"
              >
                <Icon.Search />
              </button>
            </div>

            <a href="https://joyzze.com/compare" className="hidden sm:grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" aria-label="Compare">
              <Icon.Shuffle />
            </a>

            <div className="hidden sm:flex items-center">
              <a href="https://joyzze.com/account.php" className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" aria-label="Account">
                <Icon.User />
              </a>
              <Icon.CaretDown className="ml-1 opacity-80" />
            </div>

            <a href="https://joyzze.com/cart.php" className="grid place-items-center w-9 h-9 rounded-md hover:bg-black/5" aria-label="Cart">
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
              <NavButton id="all" href="https://joyzze.com/all-products/">All Products</NavButton>
              <NavButton id="clippers" href="https://joyzze.com/clippers/">Clippers</NavButton>
              <NavButton id="blades" href="https://joyzze.com/blades/">Blades</NavButton>
              <NavButton id="combs" href="https://joyzze.com/combs-accessories/">Combs &amp; Accessories</NavButton>
              <NavButton id="info" href="https://joyzze.com/information/">Information</NavButton>
              <a href="https://joyzze.com/recycling-sharpening/" className="jz-item">Recycling &amp; Sharpening</a>
              <a href="https://joyzze.com/distributor/" className="jz-item">Distributor</a>
            </div>
          </div>

          {/* Shared mega panel */}
          {open && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[8px]" onMouseEnter={()=>setOpen(open)}>
              <div className="jz-mega w-full max-w-[1280px]">
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
                      <MegaSection title="A-SERIES | A5 STYLE"><li><a href="https://joyzze.com/a5-blades/">A5 Blades</a></li></MegaSection>
                      <MegaSection title="A-SERIES - WIDE | A5 STYLE">
                        <li><a href="https://joyzze.com/wide-blades-a-series/">Wide Blades</a></li>
                        <li><a href="https://joyzze.com/joyzze-bundle-plus/">Bundle Plus</a></li>
                        <li><a href="https://joyzze.com/joyzze-bundle/">Bundle</a></li>
                      </MegaSection>
                      <MegaSection title="C-SERIES | 5-IN-1 CLIPPERS"><li><a href="https://joyzze.com/c-max-blades/">C-MAX Blades</a></li></MegaSection>
                      <MegaSection title="M-SERIES | MINI TRIMMERS"><li><a href="https://joyzze.com/mini-trimmer-blades/">Mini Trimmer Blades</a></li></MegaSection>
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

/* =========================================================
   HERO / HOW / SAMPLES
   ========================================================= */
function Hero(){
  return (
    <header className="relative overflow-hidden bg-[#323030] text-white">
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">Joyzze</div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Make your dog look freshly groomed—<span className="text-[#00e1c9]">with AI</span></h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>. Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="btn btn-primary !bg-[#323030]">Try it free</a>
            <a href="#how" className="btn text-white border border-white/20 bg-[#121a2b] hover:bg-[#121a2b]">See how it works</a>
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
    <section id="how" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 mb-10">Upload your photo → AI grooms the dog → compare before &amp; after.</p>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
          <div className="mt-auto pt-4"><a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">Upload now</a></div>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600">We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.</p>
          <div className="mt-auto pt-4"><a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">Start grooming</a></div>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-[#323030] text-white grid place-items-center text-xs mb-3">3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600">Use the slider to compare before/after. Download the result in one click.</p>
          <div className="mt-auto pt-4"><a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">Try the slider</a></div>
        </Card>
      </div>
    </section>
  );
}

function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 mb-10">Background, breed, pose, lighting and colors stay identical—only grooming changes.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200"><img src="/dog-1.jpg" alt="Sample 1" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200"><img src="/dog-2.jpg" alt="Sample 2" className="w-full h-auto object-cover" /></div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200"><img src="/dog-3.jpg" alt="Sample 3" className="w-full h-auto object-cover" /></div>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER (Joyzze-style)
   ========================================================= */
function FooterPromoRibbon(){
  return (
    <div className="bg-[#0e0e0e] text-[#d9d9d9]">
      <div className="max-w-[1280px] mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-6 text-[13px]">
        <div className="flex items-center gap-3"><Icon.Truck className="text-[var(--joyzze-teal)]" /><span>Free Shipping on orders over $350</span></div>
        <div className="flex items-center gap-3"><Icon.Return className="text-[var(--joyzze-teal)]" /><span>Hassle Free Returns</span></div>
        <div className="flex items-center gap-3"><Icon.Card className="text-[var(--joyzze-teal)]" /><span>All Major Cards Accepted</span></div>
        <div className="flex items-center gap-3"><Icon.Lock className="text-[var(--joyzze-teal)]" /><span>100% Safe &amp; Secure Checkout</span></div>
      </div>
    </div>
  );
}

function SigninFooter() {
  return (
    <footer className="bg-[#4a4a4a] text-slate-100">
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
            <img src="/joyzze-logo.svg" alt="Joyzze" className="h-9 w-auto" onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>'}}/>
          </div>
          <p className="mt-3 text-sm text-white/80">Joy of Grooming Made Easy™</p>

          <div className="mt-6 space-y-1 text-[15px] text-slate-100">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com" className="hover:underline">info@joyzze.com</a></div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a className="w-9 h-9 grid place-items-center rounded-md bg-transparent ring-1 ring-white/15 hover:bg-white/5" href="#" aria-label="Facebook">f</a>
            <a className="w-9 h-9 grid place-items-center rounded-md bg-transparent ring-1 ring-white/15 hover:bg-white/5" href="#" aria-label="Instagram">◎</a>
          </div>
        </div>

        {/* Right: Newsletter */}
        <div className="lg:justify-self-end">
          <h4 className="text-[var(--joyzze-teal)] tracking-wide text-lg mb-4">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="flex items-stretch w-full max-w-[360px]">
            <input type="email" placeholder="Email address..." className="px-3 py-3 flex-1 rounded-l-md text-black text-sm outline-none"/>
            <button type="submit" className="px-4 rounded-r-md bg-[var(--joyzze-teal)] text-black text-sm font-semibold">✉</button>
          </form>
        </div>
      </div>

      {/* Bottom row with series + cards strip */}
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
        <div className="mt-6 flex items-center justify-end gap-4 opacity-90 text-xs">
          <span className="px-2 py-1 rounded bg-white/10">AMEX</span>
          <span className="px-2 py-1 rounded bg-white/10">Discover</span>
          <span className="px-2 py-1 rounded bg-white/10">PayPal</span>
          <span className="px-2 py-1 rounded bg-white/10">VISA</span>
          <span className="px-2 py-1 rounded bg-white/10">MasterCard</span>
        </div>
      </div>

      <div className="bg-black/80 text-white text-xs px-4 py-2">Manage Website Data Collection Preferences</div>
    </footer>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Page(){
  return (
    <main>
      <SigninHeader />
      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <SigninFooter />

      {/* Global styles for Joyzze look */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

        :root { --joyzze-teal: #1CD2C1; }

        .btn { display:inline-flex; gap:.5rem; align-items:center; padding:.55rem .9rem; border-radius:.6rem; }
        .btn-primary { background:var(--joyzze-teal); color:#0b0b0b; }
        .btn-ghost { background:transparent; border:1px solid rgba(0,0,0,.08); }
        .card { background:#fff; border-radius:1rem; box-shadow:0 1px 0 rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.06); }

        .jz-nav, .jz-item, .jz-mega, .jz-sec-title, .jz-list, .jz-input {
          font-family: 'Josefin Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
        }
        .jz-nav { font-weight:600; font-size:15px; letter-spacing:.01em; }
        .jz-item { padding:14px 20px; position:relative; line-height:1; color:#d7d7d7; text-decoration:none; }
        .jz-item:hover { color:#fff; }
        .caret { margin-left:6px; opacity:.75; transition:transform .18s ease, opacity .18s ease; }
        .jz-item.jz-active .caret, .jz-item:hover .caret { transform:translateY(1px) rotate(180deg); opacity:1; }

        .jz-underline { position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--joyzze-teal); opacity:0; transition:opacity .18s ease; }
        .jz-pointer { position:absolute; left:50%; transform:translateX(-50%); bottom:-6px; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid var(--joyzze-teal); opacity:0; transition:opacity .18s ease; }
        .jz-item.jz-active .jz-underline, .jz-item:hover .jz-underline,
        .jz-item.jz-active .jz-pointer,   .jz-item:hover .jz-pointer { opacity:1; }

        /* MEGA PANEL */
        .jz-mega {
          border: 1px solid rgba(28,210,193,.85);
          border-top-width: 3px;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(1px);
          box-shadow: 0 32px 64px -20px rgba(0,0,0,.35), 0 12px 24px rgba(0,0,0,.12);
          border-radius: 2px;
        }
        .jz-mega-bg {
          position:absolute; inset:0;
          background-image: radial-gradient(1200px 500px at 70% 20%, rgba(0,0,0,.08), transparent 60%);
          background-position: center;
          opacity:.12; pointer-events:none; border-radius:2px;
        }

        .jz-sec-title {
          margin-bottom:12px; color:#2f2f2f; font-weight:600;
          text-transform:uppercase; letter-spacing:.06em; font-size:14px;
        }
        .jz-list { list-style:none; padding:0; margin:0; }
        .jz-list li { padding:9px 0; border-bottom:1px solid rgba(0,0,0,.06); }
        .jz-list li:last-child { border-bottom:0; }
        .jz-list a { color:#3f3f3f; font-size:15px; text-decoration:none; }
        .jz-list a:hover { color:#111; }

        .jz-input:focus { box-shadow: 0 0 0 3px rgba(0,0,0,.06); }
      `}</style>
    </main>
  );
}
