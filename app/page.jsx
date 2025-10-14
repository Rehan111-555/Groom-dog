'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ───────────────────────────── Icons (no TS) ───────────────────────────── */
const Icon = {
  Upload: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Wand: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Reset: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Download: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Phone: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5c0 8.284 6.716 15 15 15v-3a2 2 0 0 0-2-2l-2 .5a16 16 0 0 1-6.5-6.5L8 7a2 2 0 0 0-2-2H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Search: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/><path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>),
  Plus: (p)=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>),
  Shuffle: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p} style={{transform:'rotate(-8deg)'}}><path d="M3 6h4l4 6 4 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M17 6h4l-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M11 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  User: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  CaretDown: (p)=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>),
  Bag: (p)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Truck: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 6h10v8H3zM13 10h4l4 4v4h-4M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  Return: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M20 18a8 8 0 1 0-3.1-15.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>),
  Card: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.6"/></svg>),
  Lock: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.7"/></svg>),
  Sun: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  Moon: (p)=>(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M21 12.3A8.5 8.5 0 1 1 11.7 3 7 7 0 0 0 21 12.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

/* ───────────────────────── Helpers ───────────────────────── */
const Button = ({ className="", disabled, onClick, children, type="button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);

function pickResultUrl(data){
  if (data && typeof data === "object") {
    if (typeof data.image === "string" && data.image.length) return data.image.startsWith("data:") ? data.image : `data:image/png;base64,${data.image}`;
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

/* ───────────────────────── Compare slider ───────────────────────── */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="cmp-wrap">
      <img src={afterSrc} alt="After" className="cmp-img" draggable={false}/>
      <img src={beforeSrc} alt="Before" className="cmp-img" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false}/>
      <div className="cmp-divider" style={{ left: `${pos}%` }} />
      <div className="cmp-handle" style={{ left: `${pos}%` }}>
        <div className="cmp-handle-dot"><span className="arrow">&lsaquo;</span><span className="arrow">&rsaquo;</span></div>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="cmp-range" aria-label="Compare before / after"/>
    </div>
  );
}

/* ───────────────────────── Upload + Result ───────────────────────── */
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

  useEffect(() => {
    const setH = () => setPanelH(Math.round(Math.max(520, Math.min(820, window.innerHeight * 0.72))));
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
    <section id="app" className="container">
      <div className="two-col">
        <div className="panel">
          <div className="panel-head">Input</div>
          <div className="panel-body" style={{height: panelH}}>
            {!previewUrl ? (
              <label className="dropzone">
                <div className="drop-inner">
                  <div className="circle"><Icon.Upload/></div>
                  <div className="dz-title">Drag &amp; drop or click to upload</div>
                  <div className="dz-sub">PNG, JPG up to 12MB</div>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={selectFile}/>
              </label>
            ) : (
              <div className="image-wrap">
                <img src={previewUrl} alt="Uploaded" className="image-fit"/>
              </div>
            )}
          </div>
          <div className="panel-actions">
            {!previewUrl && error && <div className="err">{String(error)}</div>}
            {!previewUrl ? (
              <Button className="btn-primary" onClick={()=>document.querySelector('#app input[type=file]')?.click()}>
                <Icon.Upload/> Upload
              </Button>
            ) : !loading ? (
              <>
                <Button className="btn-primary" onClick={groom}><Icon.Wand/> Groom</Button>
                <Button className="btn-ghost" onClick={resetAll}><Icon.Reset/> Reset</Button>
              </>
            ) : (
              <>
                <Button className="btn-primary" disabled><Icon.Wand/> Working… {progress}%</Button>
                <Button className="btn-ghost" onClick={cancel}><Icon.Reset/> Cancel</Button>
              </>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head row">
            <span>Groomed dog using hornet</span>
            {resultUrl && <a className="btn btn-primary small" href={resultUrl} download><Icon.Download/> Download</a>}
          </div>
          <div className="panel-body" style={{height: panelH}}>
            {!resultUrl ? (
              <div className="placeholder">
                Your groomed image will appear here. After processing, use the slider to compare before/after.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl || ''} afterSrc={resultUrl}/>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Header + Mega ───────────────────────── */
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

  const topBarClass = theme === 'light' ? 'bg-[#cfcfcf]' : 'bg-[#1c1f26]';
  const iconBtn = 'icon-btn grid place-items-center w-9 h-9 rounded-md hover:bg-black/5';

  return (
    <header className="w-full sticky top-0 z-50">
      <div className={topBarClass}>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
          <a href="tel:(877) 456-9993" className="justify-self-start flex items-center gap-2 text-[#0f0f0f] dark:text-white">
            <Icon.Phone className="opacity-85" />
            <span className="text-[15px] font-semibold tracking-[.01em]">(877) 456-9993</span>
          </a>
          <a href="https://joyzze.com/" className="justify-self-center block rounded-[10px] overflow-hidden shadow-[0_12px_26px_rgba(0,0,0,.35)]" aria-label="Joyzze">
            <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0d0d0d] px-7 py-2.5 rounded-[10px]">
              <img
                src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png"
                alt="Joyzze"
                className="h-[52px] w-auto align-middle"
                onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-[28px] font-semibold tracking-[0.25em] px-4">JOYZZE</span>'}}
              />
            </div>
          </a>
          <div className="justify-self-end flex items-center gap-4">
            <div className="relative hidden md:block">
              <form action="/search.php" method="get">
                <input type="text" name="search_query" placeholder="Search..." autoComplete="off" aria-label="Search" className="jz-input"/>
              </form>
              <Icon.Plus className="search-plus text-[#0f0f0f]/85" />
              <button className="search-btn" aria-label="Search"><Icon.Search/></button>
            </div>
            <a className={`hidden sm:grid ${iconBtn}`} href="/compare" aria-label="Compare"><Icon.Shuffle /></a>
            <div className="hidden sm:flex items-center">
              <a className={`${iconBtn}`} href="/account.php" aria-label="Account"><Icon.User /></a>
              <Icon.CaretDown className="ml-[2px] opacity-80" />
            </div>
            <a className={`${iconBtn}`} href="/cart.php" aria-label="Cart"><Icon.Bag /></a>
            <button onClick={onToggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? <Icon.Sun/> : <Icon.Moon/>}
              <span className="ml-2 text-[13px]">{theme==='light'?'Light':'Dark'}</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="nav-dark" onMouseLeave={close}>
        <div className="nav-wrap">
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
                        <li><a href="https://joyzze.com/a-series-raptor-falcon-wide/">A-Series | Wide</a></li>
                        <li><a href="https://joyzze.com/c-series-hornet-stinger-blades-all/">C-Series | 5-in-1</a></li>
                        <li><a href="https://joyzze.com/d-series-piranha/">D-Series | Piranha</a></li>
                        <li><a href="https://joyzze.com/m-series-hornet-mini/">M-Series | Mini</a></li>
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
                      <MegaSection title="A5 STYLE | A-SERIES">
                        <li><a href="https://joyzze.com/falcon/">Falcon</a></li>
                        <li><a href="https://joyzze.com/raptor-clippers/">Raptor</a></li>
                      </MegaSection>
                      <MegaSection title="D-SERIES">
                        <li><a href="https://joyzze.com/piranha-clippers/">Piranha</a></li>
                        <li className="mt-2" />
                        <li className="jz-sec-title !mb-2">PARTS</li>
                        <li><a href="https://joyzze.com/a5-falcon/">A5 Falcon</a></li>
                        <li><a href="https://joyzze.com/a5-raptor/">A5 Raptor</a></li>
                      </MegaSection>
                    </>
                  )}

                  {open === 'blades' && (
                    <>
                      <MegaSection title="A-SERIES | A5 STYLE"><li><a href="https://joyzze.com/a5-blades/">A5 Blades</a></li></MegaSection>
                      <MegaSection title="A-SERIES WIDE | A5">
                        <li><a href="https://joyzze.com/wide-blades-a-series/">Wide Blades</a></li>
                        <li><a href="https://joyzze.com/joyzze-bundle-plus/">Bundle Plus</a></li>
                        <li><a href="https://joyzze.com/joyzze-bundle/">Bundle</a></li>
                      </MegaSection>
                      <MegaSection title="C-SERIES | 5-IN-1"><li><a href="https://joyzze.com/c-max-blades/">C-MAX Blades</a></li></MegaSection>
                    </>
                  )}

                  {open === 'combs' && (
                    <>
                      <MegaSection title="A-SERIES | WIDE COMBS">
                        <li><a href="https://joyzze.com/a-series-wide-metal-combs/">Wide Metal Combs</a></li>
                        <li><a href="https://joyzze.com/bundle/">Bundle</a></li>
                        <li><a href="https://joyzze.com/bundle-plus/">Bundle Plus</a></li>
                      </MegaSection>
                      <MegaSection title="A & D SERIES">
                        <li><a href="https://joyzze.com/a-d-series-8-piece-metal-comb-set/">8 Piece Metal Comb Set</a></li>
                      </MegaSection>
                      <MegaSection title="CASES">
                        <li><a href="https://joyzze.com/12-slot/">12-Slot</a></li>
                        <li><a href="https://joyzze.com/22-slot/">22-Slot</a></li>
                      </MegaSection>
                    </>
                  )}

                  {open === 'info' && (
                    <>
                      <MegaSection title="ABOUT">
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
                        <li><a href="https://joyzze.com/clipper-repair-form-joyzze/">Clipper Repair Form</a></li>
                        <li><a href="https://joyzze.com/warranty-joyzze/">Warranty</a></li>
                        <li><a href="https://joyzze.com/joyzze-product-brochure/">Product Brochure</a></li>
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

/* ───────────────────────── Hero / How / Samples ───────────────────────── */
function Hero(){
  return (
    <header className="hero">
      <div className="hero-inner">
        <div>
          <span className="hero-pill">Joyzze</span>
          <h1 className="hero-title">Make your dog look freshly groomed—<span className="emph">with AI</span></h1>
          <p className="hero-sub">Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>. Compare before &amp; after with a slider.</p>
          <div className="hero-cta">
            <a href="#app" className="btn btn-primary">Try it free</a>
            <a href="#how" className="btn btn-ghost">See how it works</a>
          </div>
        </div>
        <div className="hero-art" />
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="container">
      <h2 className="section-title">Three simple steps</h2>
      <p className="section-sub">Upload your photo → AI grooms the dog → compare before &amp; after.</p>
      <div className="three-col">
        <div className="card p-6">
          <div className="step-dot">1</div>
          <h3 className="mb-1">Upload a dog photo</h3>
          <p className="muted">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
          <div className="pt-4"><a href="#app" className="btn btn-primary">Upload now</a></div>
        </div>
        <div className="card p-6">
          <div className="step-dot">2</div>
          <h3 className="mb-1">Let AI groom</h3>
          <p className="muted">We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.</p>
          <div className="pt-4"><a href="#app" className="btn btn-primary">Start grooming</a></div>
        </div>
        <div className="card p-6">
          <div className="step-dot">3</div>
          <h3 className="mb-1">Compare &amp; download</h3>
          <p className="muted">Use the slider to compare before/after. Download the result in one click.</p>
          <div className="pt-4"><a href="#app" className="btn btn-primary">Try the slider</a></div>
        </div>
      </div>
    </section>
  );
}

function Samples(){
  return (
    <section id="examples" className="container">
      <h2 className="section-title">Sample results</h2>
      <p className="section-sub">Background, breed, pose, lighting and colors stay identical—only grooming changes.</p>
      <div className="three-col">
        <div className="sample"><img src="/dog-1.jpg" alt="Sample 1"/></div>
        <div className="sample"><img src="/dog-2.jpg" alt="Sample 2"/></div>
        <div className="sample"><img src="/dog-3.jpg" alt="Sample 3"/></div>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */
function FooterPromoRibbon(){
  return (
    <div className="promo-ribbon">
      <div className="promo-grid">
        <div className="promo-item"><Icon.Truck className="text-[var(--joyzze-teal)]"/><span>Free Shipping on orders over $350</span></div>
        <div className="promo-item"><Icon.Return className="text-[var(--joyzze-teal)]"/><span>Hassle Free Returns</span></div>
        <div className="promo-item"><Icon.Card className="text-[var(--joyzze-teal)]"/><span>All Major Cards Accepted</span></div>
        <div className="promo-item"><Icon.Lock className="text-[var(--joyzze-teal)]"/><span>100% Safe &amp; Secure Checkout</span></div>
      </div>
    </div>
  );
}

function SigninFooter() {
  return (
    <footer className="footer">
      <FooterPromoRibbon />
      <div className="footer-inner">
        <div>
          <h4 className="footer-title">LINKS</h4>
          <ul className="footer-links">
            <li><a href="https://joyzze.com/all-products/">All Products</a></li>
            <li><a href="https://joyzze.com/clippers/">Clippers</a></li>
            <li><a href="https://joyzze.com/blades/">Blades</a></li>
            <li><a href="https://joyzze.com/combs-accessories/">Combs &amp; Accessories</a></li>
            <li><a href="https://joyzze.com/information/">Information</a></li>
            <li><a href="https://joyzze.com/recycling-sharpening/">Recycling &amp; Sharpening</a></li>
            <li><a href="https://joyzze.com/distributor/">Distributor</a></li>
            <li><a href="https://joyzze.com/sitemap.php">View All</a></li>
          </ul>
        </div>

        <div className="text-center">
          <div className="logo-capsule">
            <img src="https://cdn11.bigcommerce.com/s-buaam68bbp/images/stencil/250x80/joyzze-logo-300px_1_1661969382__49444.original.png" alt="Joyzze" onError={(e)=>{e.currentTarget.outerHTML='<span class="text-white text-2xl font-semibold tracking-[0.25em]">JOYZZE</span>'}}/>
          </div>
          <p className="mt-3 text-sm text-white/85">Joy of Grooming Made Easy™</p>
          <div className="mt-4 space-y-1 text-[15px]">
            <div>(877) 456-9993</div>
            <div><a href="mailto:info@joyzze.com">info@joyzze.com</a></div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a className="social">f</a>
            <a className="social">◎</a>
          </div>
        </div>

        <div className="justify-self-end">
          <h4 className="footer-title">SUBSCRIBE TO<br/>OUR NEWSLETTER</h4>
          <form className="subs">
            <input type="email" placeholder="Email address..." className="subs-input"/>
            <button type="submit" className="subs-btn">✉</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copy">© {new Date().getFullYear()} Joyzze . All rights reserved. | Sitemap</div>
        <div className="series">
          <span className="teal">SERIES</span>
          <a href="https://joyzze.com/a-series/">A-SERIES</a>
          <a href="https://joyzze.com/c-series/">C-SERIES</a>
          <a href="https://joyzze.com/d-series/">D-SERIES</a>
          <a href="https://joyzze.com/m-series/">M-SERIES</a>
          <a href="https://joyzze.com/all-products/">View All</a>
        </div>
        <div className="cards">
          <span>AMEX</span><span>Discover</span><span>PayPal</span><span>VISA</span><span>MasterCard</span>
        </div>
      </div>
      <div className="pref">Manage Website Data Collection Preferences</div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */
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

      {/* Global CSS (unchanged, theme-safe) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
        :root { --joyzze-teal:#1CD2C1; }
        html,body{ font-family:'Josefin Sans',system-ui,-apple-system,Segoe UI,Arial,sans-serif; }

        :root{
          --bg:#ffffff; --text:#0f1115; --muted:#475569;
          --surface:#ffffff; --panel:#f7f8fa;
          --border:rgba(0,0,0,.10); --panelBorder:rgba(0,0,0,.12);
          --heroStart:#0f172a; --heroMid:#1f2937; --heroEnd:#0f172a;
        }
        .theme-dark{
          --bg:#0f1115; --text:#e5e7eb; --muted:rgba(229,231,235,.78);
          --surface:#15181f; --panel:#0e1218;
          --border:rgba(255,255,255,.10); --panelBorder:rgba(255,255,255,.14);
          --heroStart:#0b1220; --heroMid:#0f172a; --heroEnd:#0b1220;
        }
        body{ background:var(--bg); color:var(--text); }

        .btn{ display:inline-flex; gap:.5rem; align-items:center; padding:.55rem .9rem; border-radius:.6rem; border:1px solid transparent; }
        .btn-primary{ background:var(--joyzze-teal); color:#0b0b0b; }
        .btn-ghost{ background:transparent; border:1px solid var(--panelBorder); color:inherit; }
        .card{ background:var(--surface); border-radius:1rem; box-shadow:0 1px 0 var(--panelBorder), 0 10px 25px rgba(0,0,0,.05); }
        .p-6{ padding:1.5rem; } .mb-1{ margin-bottom:.25rem; }

        .jz-input{ height:44px; width:520px; max-width:520px; border:1px solid var(--panelBorder); background:var(--surface); color:inherit; border-radius:.5rem; padding:0 58px 0 16px; outline:none; }
        .search-plus{ position:absolute; right:56px; top:50%; transform:translateY(-50%); opacity:.7; }
        .search-btn{ position:absolute; right:8px; top:50%; transform:translateY(-50%); height:32px; width:32px; display:grid; place-items:center; border-radius:999px; border:1px solid var(--panelBorder); background:var(--surface); }
        .theme-toggle{ height:36px; padding:0 .6rem; border:1px solid var(--panelBorder); border-radius:.5rem; background:var(--surface); display:flex; align-items:center; }

        .nav-dark{ background:#2f2f2f; color:#d7d7d7; border-top:1px solid rgba(0,0,0,.12); }
        .nav-wrap{ max-width:1280px; margin:0 auto; padding:0 .75rem; position:relative; }
        .jz-nav{ font-weight:600; font-size:15px; letter-spacing:.01em; }
        .jz-item { padding:14px 20px; position:relative; line-height:1; color:#d7d7d7; text-decoration:none; }
        .jz-item:hover { color:var(--joyzze-teal); }
        .caret { margin-left:6px; opacity:.75; transition:transform .18s ease, opacity .18s ease; }
        .jz-item.jz-active .caret, .jz-item:hover .caret { transform:translateY(1px) rotate(180deg); opacity:1; }
        .jz-underline { position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--joyzze-teal); opacity:0; transition:opacity .18s ease; }
        .jz-pointer  { position:absolute; left:50%; transform:translateX(-50%); bottom:-6px; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid var(--joyzze-teal); opacity:0; transition:opacity .18s ease; }
        .jz-item.jz-active .jz-underline, .jz-item:hover .jz-underline,
        .jz-item.jz-active .jz-pointer,   .jz-item:hover .jz-pointer { opacity:1; }

        .jz-mega{ position: relative; border:1px solid rgba(28,210,193,.85); border-top-width:3px; background:rgba(255,255,255,.96); backdrop-filter: blur(2px); box-shadow: 0 32px 64px -20px rgba(0,0,0,.35), 0 12px 24px rgba(0,0,0,.12); border-radius:2px; overflow:hidden; z-index:60; }
        .jz-mega-bg{ position:absolute; inset:0; background-image: radial-gradient(1000px 440px at 75% 18%, rgba(0,0,0,.08), transparent 60%); opacity:.14; pointer-events:none; border-radius:2px; }
        .jz-sec-title { margin:0 0 12px; color:#2f2f2f; font-weight:700; text-transform:uppercase; letter-spacing:.06em; font-size:14px; }
        .jz-list { list-style:none; padding:0; margin:0; }
        .jz-list li { padding:9px 0; border-bottom:1px solid rgba(0,0,0,.06); }
        .jz-list li:last-child { border-bottom:0; }
        .jz-list a { color:#3f3f3f; font-size:15px; }

        .hero{ background:linear-gradient(180deg,var(--heroStart),var(--heroMid),var(--heroEnd)); color:#fff; }
        .hero-inner{ max-width:1280px; margin:0 auto; padding:2.8rem 1.25rem; display:grid; gap:2rem; grid-template-columns:1fr; align-items:center; }
        @media (min-width:1024px){ .hero-inner{ grid-template-columns:1.1fr .9fr; } }
        .hero-pill{ display:inline-block; padding:.35rem .7rem; border:1px solid rgba(255,255,255,.22); border-radius:999px; font-size:.8rem; opacity:.9; margin-bottom:.9rem; }
        .hero-title{ font-size:2.4rem; line-height:1.2; font-weight:800; margin:0; }
        @media (min-width:768px){ .hero-title{ font-size:2.8rem; } }
        .hero-sub{ margin:.9rem 0 1.2rem; color:#e5e7eb; }
        .hero-cta{ display:flex; gap:.6rem; flex-wrap:wrap; }
        .emph{ color:var(--joyzze-teal); }
        .hero-art{ width:100%; aspect-ratio:16/10; border-radius:18px; background: radial-gradient(80% 60% at 70% 35%, rgba(255,255,255,.08), transparent 60%), url('/dog-10.png'); background-size:cover; background-position:center; border:1px solid rgba(255,255,255,.14); box-shadow: 0 24px 60px rgba(0,0,0,.35), inset 0 0 0 9999px rgba(0,0,0,.06); }

        .container{ max-width:1280px; margin:0 auto; padding:2rem 1.25rem; }
        .section-title{ text-align:center; font-size:1.6rem; font-weight:700; margin:0 0 .5rem; }
        .section-sub{ text-align:center; color:var(--muted); margin:0 0 1.2rem; }
        .three-col{ display:grid; grid-template-columns:1fr; gap:20px; }
        @media (min-width:900px){ .three-col{ grid-template-columns:repeat(3,1fr); } }
        .step-dot{ width:24px; height:24px; border-radius:999px; background:#323030; color:#fff; display:grid; place-items:center; font-size:.8rem; margin-bottom:.5rem; }
        .muted{ color:var(--muted); }
        .sample{ border-radius:18px; overflow:hidden; border:1px solid var(--panelBorder); background:var(--surface); }
        .sample img{ display:block; width:100%; height:auto; object-fit:cover; }

        .two-col{ display:grid; grid-template-columns:1fr; gap:24px; }
        @media (min-width:1024px){ .two-col{ grid-template-columns:1fr 1fr; } }
        .panel{ background:var(--panel); border:1px dashed var(--panelBorder); border-radius:16px; }
        .panel-head{ padding:14px 18px; font-weight:600; border-bottom:1px dashed var(--panelBorder); display:flex; align-items:center; justify-content:space-between; }
        .panel-body{ padding:12px; border-radius:12px; margin:12px; background:var(--surface); border:1px dashed var(--panelBorder); overflow:hidden; }
        .panel-actions{ display:flex; gap:10px; align-items:center; padding:0 12px 16px 12px; }
        .err{ color:#ef4444; font-size:.92rem; margin-right:auto; }

        .dropzone{ height:100%; width:100%; display:grid; place-items:center; cursor:pointer; background:var(--panel); border-radius:12px; }
        .drop-inner{ text-align:center; color:var(--muted); }
        .circle{ width:44px; height:44px; border-radius:12px; display:grid; place-items:center; background:var(--surface); border:1px solid var(--panelBorder); margin:0 auto 10px; }
        .dz-title{ font-weight:600; }
        .dz-sub{ font-size:12px; margin-top:4px; opacity:.9; }

        .image-wrap{ width:100%; height:100%; background:var(--panel); border-radius:12px; overflow:hidden; }
        .image-fit{ width:100%; height:100%; object-fit:contain; display:block; background:var(--panel); }

        .placeholder{ height:100%; display:grid; place-items:center; text-align:center; color:var(--muted); padding:0 18px; background:var(--panel); border-radius:12px; }

        .cmp-wrap{ position:relative; height:100%; width:100%; border-radius:12px; overflow:hidden; background:var(--panel); }
        .cmp-img{ position:absolute; inset:0; width:100%; height:100%; object-fit:contain; }
        .cmp-divider{ position:absolute; top:0; bottom:0; width:2px; background:#6366f1; }
        .cmp-handle{ position:absolute; top:50%; transform:translate(-50%,-50%); }
        .cmp-handle-dot{ width:40px; height:40px; border-radius:999px; background:color-mix(in oklab, var(--surface) 90%, transparent); border:1px solid var(--panelBorder); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 10px rgba(0,0,0,.15); }
        .cmp-range{ position:absolute; left:1%; right:1%; bottom:10px; width:98%; accent-color:#6366f1; }

        .promo-ribbon{ background:#0e0e0e; color:#d9d9d9; }
        .promo-grid{ max-width:1280px; margin:0 auto; padding:.75rem 1rem; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        @media (min-width:768px){ .promo-grid{ grid-template-columns:repeat(4,minmax(0,1fr)); } }
        .promo-item{ display:flex; align-items:center; gap:.6rem; font-size:13px; }

        .footer{ background:#4a4a4a; color:#eef2f7; }
        .footer-inner{ max-width:1280px; margin:0 auto; padding:3rem 1.5rem; display:grid; gap:2rem; grid-template-columns:1fr; }
        @media (min-width:1024px){ .footer-inner{ grid-template-columns:1fr 1fr 1fr; } }
        .footer-title{ color:var(--joyzze-teal); letter-spacing:.05em; margin-bottom:.8rem; }
        .footer-links{ display:grid; gap:.5rem; }
        .footer a{ color:#eef2f7; text-decoration:none; }
        .footer a:hover{ text-decoration:underline; }

        .logo-capsule{ display:inline-block; background:linear-gradient(#2a2a2a,#0d0d0d); border-radius:10px; padding:.6rem 1.4rem; box-shadow:0 12px 26px rgba(0,0,0,.25); }
        .logo-capsule img{ height:36px; width:auto; display:block; }

        .social{ width:36px; height:36px; display:grid; place-items:center; border-radius:8px; border:1px solid rgba(255,255,255,.15); background:transparent; }
        .subs{ display:flex; max-width:360px; }
        .subs-input{ flex:1; padding:.75rem .75rem; border-radius:.5rem 0 0 .5rem; border:0; color:#111; }
        .subs-btn{ padding:0 .9rem; border-radius:0 .5rem .5rem 0; background:var(--joyzze-teal); color:#111; font-weight:600; border:0; }

        .footer-bottom{ max-width:1280px; margin:0 auto; padding:0 1.5rem 2.5rem; }
        .copy{ border-top:1px solid rgba(255,255,255,.12); padding-top:1rem; margin-top:.5rem; }
        .series{ margin-top:10px; display:flex; flex-wrap:wrap; gap:14px; align-items:center; }
        .series .teal{ color:var(--joyzze-teal); font-weight:700; }
        .cards{ margin-top:10px; display:flex; justify-content:flex-end; gap:8px; opacity:.9; font-size:.78rem; }
        .cards span{ padding:.2rem .5rem; border-radius:.35rem; background:rgba(255,255,255,.1); }

        .pref{ background:#000000cc; color:#fff; font-size:.78rem; padding:.45rem .75rem; }

        @media (max-width:1280px){ .jz-input{ width:420px; } }
        @media (max-width:980px){ .jz-input{ display:none; } }
      `}</style>
    </main>
  );
}
