'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ============ Icons (inline) ============ */
const Icon = {
  Scissors: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20 4 7 17m13 3L7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
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
};

/* ============ Small UI helpers ============ */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className="", children }) => <div className={`card ${className}`}>{children}</div>;

/* Compare slider (keeps original aspect) */
function CompareSlider({ beforeSrc, afterSrc, aspect }) {
  const [pos, setPos] = useState(55);
  const paddingTop = aspect > 0 ? `${(1 / aspect) * 100}%` : "62%";
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow" style={{ background: "#f8fafc" }}>
      <div className="relative w-full" style={{ paddingTop }}>
        <img src={afterSrc} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
        <img src={beforeSrc} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `inset(0 ${100-pos}% 0 0)` }} draggable={false}/>
        <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: "rgba(79,70,229,0.9)" }} />
      </div>
      <div className="p-3">
        <input type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full"/>
      </div>
    </div>
  );
}

/* Helpers */
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
  return new Promise((resolve,reject)=>{
    const img=new Image();
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

/* ============ Upload + Result app (prompt hidden server-side) ============ */
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

  useEffect(()=>()=>{ if(previewUrl)URL.revokeObjectURL(previewUrl); if(resultUrl?.startsWith?.("blob:"))URL.revokeObjectURL(resultUrl); },[previewUrl,resultUrl]);

  const handleFile=async (f)=>{
    setError(null);
    const validationError=validateImageFile(f,12);
    if(validationError){ setError(validationError); return; }
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
      form.append("image",file); // prompt is hidden & enforced in /api/groom
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
  const aspect = imgH ? (imgW / imgH) : 0;

  return (
    <section id="app" className="container mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white grid place-items-center shadow">
          <Icon.Scissors />
        </div>
        <div>
          <div className="badge mb-1">Flash 2.5</div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">Dog Groomer</h1>
          <p className="text-sm text-slate-600">
            Upload a dog photo → AI grooms the dog → compare before &amp; after
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left */}
        <Card className="p-6">
          {error && <div className="mb-4 rounded-2xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">{String(error)}</div>}
          {!previewUrl ? (
            <label className="block rounded-3xl border border-dashed border-slate-300 p-12 text-center cursor-pointer hover:bg-white">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white grid place-items-center shadow mb-4">
                <Icon.Upload />
              </div>
              <div className="font-medium mb-1">Drag &amp; drop or click to upload</div>
              <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile} />
            </label>
          ) : (
            <div className="space-y-6">
              <img src={previewUrl} alt="Uploaded" className="w-full rounded-2xl shadow" />
              {/* Prompt UI removed (prompt is hidden & enforced on server) */}
              <div className="flex flex-wrap items-center gap-3">
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

        {/* Right (sticky result) */}
        <div className="lg:sticky lg:top-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Result</h2>
              {resultUrl && <a className="btn btn-primary" href={resultUrl} download><Icon.Download/> Download</a>}
            </div>
            {!resultUrl ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-600 bg-slate-50/60">
                Your groomed image will appear here. After processing, use the slider to compare before/after.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} aspect={aspect} />
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ============ HERO ============ */
function Hero(){
  return (
    <header className="relative overflow-hidden bg-[#0d1324] text-white">
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">
            Flash 2.5 • Image Preview
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-indigo-300">with AI</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>.
            Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {/* NOTICE: add base `btn` class here */}
            <a href="#app" className="btn btn-primary !bg-rose-500 hover:!bg-rose-600">Try it free</a>
            <a href="#how" className="btn btn-ghost text-white border-white/20 hover:bg-white/5">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img src="/dog-4.jpg" alt="Hero sample" className="w-full h-auto object-cover" />
        </div>
      </div>
    </header>
  );
}

/* ============ 3-step section ============ */
function HowItWorks(){
  return (
    <section id="how" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 mb-10">
        Upload your photo → AI grooms the dog → compare before &amp; after.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center text-xs mb-3">1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600 mb-4">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
          {/* add base `btn` */}
          <a href="#app" className="btn btn-primary">Upload now</a>
        </Card>
        <Card className="p-6">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center text-xs mb-3">2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600 mb-4">
            We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.
          </p>
          <a href="#app" className="btn btn-primary">Start grooming</a>
        </Card>
        <Card className="p-6">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center text-xs mb-3">3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600 mb-4">Use the slider to compare before/after. Download the result in one click.</p>
          <a href="#app" className="btn btn-primary">Try the slider</a>
        </Card>
      </div>
    </section>
  );
}

/* ============ Sample results — below app, before footer ============ */
function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 mb-10">
        Background, breed, pose, lighting and colors stay identical—only grooming changes.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
          <img src="/dog-1.jpg" alt="Sample 1" className="w-full h-auto object-cover" />
        </div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
          <img src="/dog-2.jpg" alt="Sample 2" className="w-full h-auto object-cover" />
        </div>
        <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
          <img src="/dog-3.jpg" alt="Sample 3" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ============ Footer ============ */
function Footer(){
  return (
    <footer className="bg-[#0d1324] text-slate-200">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white grid place-items-center shadow"><Icon.Scissors/></div>
            <div className="font-semibold">Dog Groomer</div>
          </div>
          <p className="text-sm text-slate-400">AI grooming preview that keeps everything identical—only a neater dog.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li><a href="#how" className="hover:text-white">How it works</a></li>
            <li><a href="#examples" className="hover:text-white">Examples</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li><a className="hover:text-white">Terms</a></li>
            <li><a className="hover:text-white">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Dog Groomer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ============ Page ============ */
export default function Page(){
  return (
    <main>
      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <Footer />
    </main>
  );
}
