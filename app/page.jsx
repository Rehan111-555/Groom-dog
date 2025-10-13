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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props} style={{transform:'rotate(-8deg)'}}>
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
  Sun: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Moon: (p)=>(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M21 12.3A8.5 8.5 0 1 1 11.7 3 7 7 0 0 0 21 12.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onDown = () => {
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
      <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-500/90" style={{ left: `${pos}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -ml-4" style={{ left: `${pos}%` }}>
        <div className="h-10 w-10 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur border border-black/10 dark:border-white/10 shadow flex items-center justify-center">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
            <span className="inline-block -ml-[2px]">&lsaquo;</span>
            <span className="inline-block -mr-[2px]">&rsaquo;</span>
          </div>
        </div>
      </div>
      <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-black/60 text-white">Before</span>
      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-600/90 text-white">After</span>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function pickResultUrl(data){
  if (data && typeof data === "object") {
    if (typeof data.image === "string" && data.image.length) {
      return data.image.startsWith("data:") ? data.image : `data:image/png;base64,${data.image}`;
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
   Upload + Result (Result panel styled like your screenshot)
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
  const [status, setStatus] = useState('idle'); // idle | working | ready | error
  const [logs, setLogs] = useState([]);
  const [logsOpen, setLogsOpen] = useState(false);

  const controllerRef=useRef(null);
  const [panelH, setPanelH] = useState(560);
  const ACTION_H = 56;

  const log = (msg) => setLogs((L)=>[...L, `[${new Date().toLocaleTimeString()}] ${msg}`]);

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
    setFile(f); setResultUrl(null); setPreviewUrl(url); setStatus('idle'); setLogs([]);
    try { const { w, h } = await readImageSize(url); setImgW(w); setImgH(h); log(`Loaded image ${w}x${h}`); } catch {}
  };
  const selectFile=(e)=>{ const f=e?.target?.files?.[0]; if(f)handleFile(f); };

  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setResultUrl(null); setProgress(0); setError(null); setStatus('idle'); setLogs([]); };

  const groom=async()=>{
    if(!file) return;
    setLoading(true); setError(null); setProgress(12); setStatus('working'); setLogs([]);
    log('Starting request to /api/groom');
    controllerRef.current=new AbortController();
    try{
      const form=new FormData();
      form.append("image",file);
      form.append("dog_only","true");
      if (imgW && imgH) { form.append("target_w", String(imgW)); form.append("target_h", String(imgH)); log(`Target size ${imgW}x${imgH}`); }

      const res=await fetch("/api/groom",{ method:"POST", body:form, signal:controllerRef.current?.signal });
      setProgress(60);
      log(`Response status: ${res.status}`);
      if(!res.ok){ const msg=await safeReadText(res); log(`Error body: ${msg.slice(0,200)}`); throw new Error(msg||`Backend error (${res.status})`); }
      const data=await res.json();
      const url=pickResultUrl(data);
      if(!url) throw new Error("Unexpected response from backend.");
      try {
        const { w, h } = await readImageSize(url);
        if (imgW && imgH && (w !== imgW || h !== imgH)) {
          log(`Padded output from ${w}x${h} to ${imgW}x${imgH}`);
          const padded = await padToSize(url, imgW, imgH);
          setResultUrl(padded);
        } else {
          setResultUrl(url);
        }
      } catch { setResultUrl(url); }
      setProgress(100);
      setStatus('ready');
      log('Done.');
    }catch(e){
      setError(e?.message||"Something went wrong.");
      setStatus('error');
      log(`Failed: ${e?.message||'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const cancel=()=>{ controllerRef.current?.abort(); setLoading(false); setStatus('idle'); log('Aborted by user'); };

  // ---------- small helpers for the result header UI ----------
  const statusPill = {
    idle:  { text:'Idle',   cls:'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
    working:{ text:'Running', cls:'bg-indigo-600 text-white' },
    ready: { text:'Success', cls:'bg-emerald-600 text-white' },
    error: { text:'Error',  cls:'bg-rose-600 text-white' },
  }[status];

  return (
    <section id="app" className="container mx-auto px-6 py-16">
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

        {/* Right: RESULT panel (Fal-style) */}
        <Card className="p-0 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Result</span>
              <span className={`text-xs px-2 py-0.5 rounded ${statusPill.cls}`}>{statusPill.text}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500 dark:text-slate-300">Preview</label>
              <select className="h-8 rounded-md bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-sm px-2">
                <option>Image</option>
                <option disabled>JSON (n/a)</option>
              </select>
            </div>
          </div>

          {/* Body */}
          <div className="p-4" style={{ minHeight: panelH + 16 }}>
            {/* empty / success / error states */}
            {status === 'error' && (
              <div className="h-[calc(100%-12px)] grid place-items-center rounded-xl border border-rose-300/50 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300">
                <div className="text-center max-w-sm">
                  <div className="text-lg font-semibold mb-2">Not enough credits</div>
                  <p className="text-sm opacity-90 mb-4">
                    {String(error || 'Your request failed.')}
                  </p>
                  <a href="#" className="btn btn-primary inline-flex">Add credits</a>
                </div>
              </div>
            )}

            {status !== 'error' && !resultUrl && (
              <div className="h-[calc(100%-12px)] grid place-items-center rounded-xl border border-dashed border-slate-300/80 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/30 text-sm text-slate-600 dark:text-slate-400 px-6 text-center">
                {loading ? 'Running…' : 'Your result will appear here after you run Groom.'}
              </div>
            )}

            {resultUrl && status === 'ready' && previewUrl && (
              <div className="rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10" style={{ height: panelH }}>
                <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} />
              </div>
            )}

            {/* cost note */}
            <div className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">
              Your request will cost $0.3 per million input tokens, and $2.5 per million output tokens.
            </div>
          </div>

          {/* Logs */}
          <div className="border-t border-black/10 dark:border-white/10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="font-medium">Logs</span>
              <button onClick={()=>setLogsOpen(v=>!v)} className="text-sm px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
                {logsOpen ? 'Hide' : 'Show'}
              </button>
            </div>
            {logsOpen && (
              <div className="px-4 pb-4">
                <pre className="text-xs bg-black/5 dark:bg-white/5 rounded-md p-3 whitespace-pre-wrap leading-relaxed max-h-52 overflow-auto">
                  {logs.length ? logs.join('\n') : '— No logs yet —'}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ====== The rest of your page (header/hero/footer) stays the same ====== */
/* Minimal shell so this file runs standalone. Replace with your existing layout if needed. */

function Hero(){ return null; }
function HowItWorks(){ return null; }
function Samples(){ return null; }

function SigninHeader(){ return null; }
function SigninFooter(){ return null; }

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

      <style jsx global>{`
        :root { --joyzze-teal: #10b981; }
        body { background:#fff; }
        .btn { display:inline-flex; gap:.5rem; align-items:center; padding:.55rem .9rem; border-radius:.65rem; transition:all .15s ease; }
        .btn-primary { background:var(--joyzze-teal); color:#0b0b0b; }
        .btn-ghost { background:transparent; border:1px solid rgba(0,0,0,.08); color:inherit; }
        .card { background:rgba(255,255,255,.85); border-radius:1.05rem; box-shadow:0 1px 0 rgba(0,0,0,.08), 0 10px 25px rgba(0,0,0,.05); backdrop-filter: blur(6px); }
        .dark .card { background:#141821; }
      `}</style>
    </main>
  );
}
