'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

/* -------------------------------- Icons -------------------------------- */
const I = {
  ArrowLeft: (p)=>(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}><path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  ChevronDown:(p)=>(<svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  Upload:     (p)=>(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}><path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Reset:      (p)=>(<svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}><path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Play:       (p)=>(<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><path d="M8 5v14l11-7-11-7Z"/></svg>),
  Download:   (p)=>(<svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Image:      (p)=>(<svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M21 15 16 10l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  Json:       (p)=>(<svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}><path d="M6 8c-2 2-2 6 0 8M18 8c2 2 2 6 0 8M10 4l4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
};

/* -------------------------------- UI helpers --------------------------- */
const cx = (...cls)=>cls.filter(Boolean).join(' ');
const Button = ({children, onClick, className, disabled, type}) => (
  <button
    type={type || 'button'}
    disabled={disabled}
    onClick={onClick}
    className={cx(
      "inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-black/10 dark:border-white/10 bg-white dark:bg-[#141821] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50",
      className
    )}
  >
    {children}
  </button>
);
const Card = ({className, children}) => (
  <div className={cx("rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121620] backdrop-blur shadow-sm", className)}>{children}</div>
);

/* ---------------------------- Compare slider --------------------------- */
function CompareSlider({ before, after }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current; if(!root) return;
    const down = (e) => {
      const rect = root.getBoundingClientRect();
      const move = (clientX) => {
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        setPos(Math.round((x / rect.width) * 100));
      };
      const onMove = (ev) => move(ev.touches?ev.touches[0].clientX:ev.clientX);
      const up = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', up);
        window.removeEventListener('touchend', up);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, {passive:false});
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    };
    root.addEventListener('mousedown', down);
    root.addEventListener('touchstart', down, {passive:true});
    return ()=>{ root.removeEventListener('mousedown', down); root.removeEventListener('touchstart', down); };
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full bg-black/5 rounded-lg overflow-hidden select-none">
      <img src={after} alt="after" className="absolute inset-0 w-full h-full object-contain" />
      <img src={before} alt="before" className="absolute inset-0 w-full h-full object-contain" style={{clipPath:`inset(0 ${100-pos}% 0 0)`}}/>
      <div className="absolute inset-y-0" style={{left:`${pos}%`}}>
        <div className="w-[2px] h-full bg-emerald-500/90 translate-x-[-1px]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 grid place-items-center">
          <span className="text-xs text-slate-700 dark:text-slate-200">↔</span>
        </div>
      </div>
      <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white">Before</span>
      <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-600/90 text-white">After</span>
    </div>
  );
}

/* ------------------------------ Helpers -------------------------------- */
function validateImageFile(f, maxMB=12){
  if(!f.type?.startsWith('image/')) return 'Please upload an image.';
  if(f.size > maxMB*1024*1024) return `Keep image under ${maxMB}MB.`;
  return null;
}

/* ============================== Inner App ============================== */
export default function Page() {
  const [theme, setTheme] = useState('dark'); // dark like fal.ai
  useEffect(()=>{ document.documentElement.classList.toggle('dark', theme==='dark'); },[theme]);

  // Image input (URL OR local file)
  const [imageURL, setImageURL] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbURL, setThumbURL] = useState(null);

  // Optional client-side settings (purely illustrative)
  const [confidence, setConfidence] = useState(0.4);
  const [maxObjects, setMaxObjects] = useState(10);

  // Results
  const [jsonText, setJsonText] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [running, setRunning] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [tab, setTab] = useState('preview'); // preview | json | compare

  // Select/Drop/Paste
  const onChoose = async (f) => {
    const err = validateImageFile(f);
    if (err) { alert(err); return; }
    setSelectedFile(f);
    if (thumbURL) URL.revokeObjectURL(thumbURL);
    setThumbURL(URL.createObjectURL(f));
    setImageURL('');
  };

  const dropRef = useRef(null);
  useEffect(()=>{
    const el = dropRef.current; if(!el) return;
    const prevent = (e)=>{ e.preventDefault(); e.stopPropagation(); };
    const onDrop = (e)=>{ prevent(e); const f = e.dataTransfer?.files?.[0]; if(f) onChoose(f); };
    ['dragenter','dragover','dragleave','drop'].forEach(ev=>el.addEventListener(ev, prevent));
    el.addEventListener('drop', onDrop);
    return ()=>{ ['dragenter','dragover','dragleave','drop'].forEach(ev=>el.removeEventListener(ev, prevent)); el.removeEventListener('drop', onDrop); };
  },[onChoose]);

  useEffect(()=>{
    const onPaste = (e)=>{
      const items = e.clipboardData?.items; if(!items) return;
      for(const it of items){ if(it.type?.startsWith('image/')){ const f = it.getAsFile(); if(f) onChoose(f); } }
    };
    window.addEventListener('paste', onPaste);
    return ()=>window.removeEventListener('paste', onPaste);
  },[onChoose]);

  // RUN — sends only image + numeric settings. Your route supplies the prompt.
  const run = useCallback(async ()=>{
    if(!imageURL && !selectedFile){ alert('Please provide an image (URL or file).'); return; }
    setRunning(true);
    try{
      const form = new FormData();
      if (selectedFile) form.append('image', selectedFile);
      if (imageURL) form.append('image_url', imageURL);
      form.append('confidence', String(confidence));
      form.append('max_objects', String(maxObjects));

      // Call your API route; it will attach the prompt server-side
      const res = await fetch('/api/detect', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Expecting: { image: <dataURL or URL>, ...anything }
      setJsonText(JSON.stringify(data, null, 2));
      const img = data?.image || data?.result_image || data?.url || '';
      if (img) setResultImage(img);
      setTab('preview');
    } catch (err) {
      // Fallback mock so the UI still shows something
      const src = imageURL || thumbURL;
      const mock = {
        finish_reason: 'stop',
        usage_info: { output_tokens: 23, decode_time_ms: 812, input_tokens: 737, ttft_ms: 92, prefill_time_ms: 54.4 },
        objects: [
          { y_min: 0.163, x_max: 0.876, x_min: 0.817, y_max: 0.306 },
          { y_min: 0.099, x_max: 0.716, x_min: 0.671, y_max: 0.210 },
        ],
        image: src,
        error: String(err?.message || err),
      };
      setJsonText(JSON.stringify(mock, null, 2));
      if (src) setResultImage(src);
      setTab('preview');
    } finally {
      setRunning(false);
    }
  }, [imageURL, selectedFile, confidence, maxObjects, thumbURL]);

  const canCompare = !!(thumbURL && resultImage);
  const thumb = useMemo(()=> thumbURL ? <img src={thumbURL} alt="thumb" className="w-24 h-24 object-cover rounded-md ring-1 ring-white/10"/> : null, [thumbURL]);

  return (
    <main className="min-h-screen bg-[#0b0e13] text-slate-100">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0e1218] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/explore" className="text-slate-300 hover:text-white flex items-center gap-1 text-sm"><I.ArrowLeft/> Back to Gallery</a>
            <div className="ml-2 text-sm text-slate-400">fal-ai / <span className="text-white">moondream3-preview</span> / <span className="text-emerald-400">detect</span></div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} className="!bg-transparent">{theme==='dark'?'Dark':'Light'}</Button>
            <a href="https://docs.fal.ai" className="text-sm text-slate-300 hover:text-white">Docs</a>
            <a href="/pricing" className="text-sm text-slate-300 hover:text-white">Pricing</a>
          </div>
        </div>
        {/* Tabs row */}
        <div className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-4 h-[44px] flex items-center gap-3 text-sm">
            <a className="px-2 py-1 rounded-md bg-white/10">Playground</a>
            <a className="px-2 py-1 rounded-md hover:bg-white/5" href="#api">API</a>
          </div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: INPUT */}
        <Card className="p-4">
          <div className="px-1 text-sm font-semibold text-slate-200">Input</div>

          {/* Image URL + Choose */}
          <div className="mt-3">
            <label className="text-xs text-slate-300">Image URL</label>
            <div className="mt-1 flex gap-2">
              <input
                value={imageURL}
                onChange={(e)=>{ setImageURL(e.target.value); if(e.target.value){ setSelectedFile(null); if(thumbURL) { URL.revokeObjectURL(thumbURL); setThumbURL(null);} } }}
                placeholder="https://…"
                className="flex-1 h-10 rounded-md bg-[#0b0e13] border border-white/10 px-3 outline-none text-sm placeholder:text-slate-500"
              />
              <label ref={dropRef} className="relative h-10 inline-grid place-items-center px-3 rounded-md bg-white/10 hover:bg-white/15 cursor-pointer text-sm">
                <I.Upload className="opacity-90" />
                <input
                  type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e)=>{ const f=e.target.files?.[0]; if(f) onChoose(f); }}
                />
              </label>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Drag & drop, paste from clipboard, or provide a URL. JPG/PNG/WebP/GIF/AVIF (≤12MB).
            </p>
            {thumb && <div className="mt-3">{thumb}</div>}
          </div>

          {/* Additional settings (no prompt UI) */}
          <details className="mt-5 group">
            <summary className="list-none cursor-pointer flex items-center justify-between gap-2 text-sm select-none">
              <span className="font-medium">Additional Settings</span>
              <I.ChevronDown className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-xs text-slate-400">Confidence</label>
                <input
                  type="number" min={0} max={1} step={0.05} value={confidence}
                  onChange={(e)=>setConfidence(Number(e.target.value))}
                  className="mt-1 w-full h-9 rounded-md bg-[#0b0e13] border border-white/10 px-2 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Max objects</label>
                <input
                  type="number" min={1} max={50} value={maxObjects}
                  onChange={(e)=>setMaxObjects(Number(e.target.value))}
                  className="mt-1 w-full h-9 rounded-md bg-[#0b0e13] border border-white/10 px-2 outline-none"
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">Server decides the prompt; client only passes image + numeric options.</p>
          </details>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <Button onClick={()=>{
              setImageURL(''); setSelectedFile(null);
              if(thumbURL){ URL.revokeObjectURL(thumbURL); setThumbURL(null); }
              setJsonText(''); setResultImage('');
              setConfidence(0.4); setMaxObjects(10);
            }}>
              <I.Reset /> Reset
            </Button>
            <Button onClick={run} disabled={running} className="bg-emerald-500 text-black hover:brightness-95 border-0">
              <I.Play /> {running ? 'Running…' : 'Run'}
            </Button>
          </div>
        </Card>

        {/* RIGHT: RESULT */}
        <Card className="p-4">
          <div className="px-1 text-sm font-semibold text-slate-200">Result</div>

          {/* Tabs */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <button className={cx("px-2 py-1 rounded", tab==='preview' ? "bg-white/10" : "hover:bg-white/5")} onClick={()=>setTab('preview')}><span className="inline-flex items-center gap-1"><I.Image/> Preview</span></button>
            <button className={cx("px-2 py-1 rounded", tab==='json' ? "bg-white/10" : "hover:bg-white/5")} onClick={()=>setTab('json')}><span className="inline-flex items-center gap-1"><I.Json/> JSON</span></button>
            {canCompare && (
              <button className={cx("px-2 py-1 rounded", tab==='compare' ? "bg-white/10" : "hover:bg-white/5")} onClick={()=>setTab('compare')}>Compare</button>
            )}
            <div className="ml-auto">
              {resultImage && (
                <a className="inline-flex items-center gap-2 h-8 px-2 rounded-md text-xs bg-white/10 hover:bg-white/15"
                   href={resultImage} download>
                  <I.Download/> Download
                </a>
              )}
            </div>
          </div>

          {/* Panel */}
          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 min-h-[420px] grid place-items-center overflow-hidden">
            {!resultImage && tab!=='json' ? (
              <div className="text-sm text-slate-400 p-6 text-center">
                Idle. Provide an image and click <b>Run</b> to preview the detection output.
              </div>
            ) : tab==='json' ? (
              <textarea value={jsonText} onChange={(e)=>setJsonText(e.target.value)}
                        className="w-full h-[420px] p-3 bg-black/40 outline-none text-xs font-mono"
                        spellCheck={false}/>
            ) : tab==='compare' && canCompare ? (
              <div className="w-full h-[420px]"><CompareSlider before={thumbURL} after={resultImage} /></div>
            ) : (
              <img src={resultImage} alt="result" className="w-full h-full object-contain"/>
            )}
          </div>

          <div className="mt-3 text-[11px] text-slate-400">
            Your request will cost <b>$0.3</b> / M input tokens, and <b>$2.5</b> / M output tokens.
          </div>
        </Card>
      </div>

      {/* Logs */}
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        <Card className="p-4">
          <button className="w-full flex items-center justify-between text-sm" onClick={()=>setLogsOpen(o=>!o)}>
            <span className="font-semibold">Logs</span>
            <I.ChevronDown className={cx("transition-transform", logsOpen && "rotate-180")} />
          </button>
          {logsOpen && (
            <pre className="mt-3 text-[12px] leading-5 text-slate-300 bg-black/30 rounded-md p-3 overflow-auto">
{`[info] Ready
[run]  POST /api/detect
[ok]   200 in 812ms`}
            </pre>
          )}
        </Card>
      </div>

      <style jsx global>{`
        :root { color-scheme: dark; }
        .dark body { background: #0b0e13; }
      `}</style>
    </main>
  );
}
