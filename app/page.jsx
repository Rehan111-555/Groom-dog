'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------- Theme ---------------- */
const BRAND = {
  charcoal: '#323030',
  charcoalHover: '#1c1c1c',
};

/* ---------------- Small SVG icons ---------------- */
const Icon = {
  Upload: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
      <path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Download: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

/* ---------------- Small UI helpers ---------------- */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>
    {children}
  </button>
);
const Card = ({ className = "", children }) => <div className={`card ${className}`}>{children}</div>;

/* ---------------- Compare slider ---------------- */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none"
         style={{ touchAction: 'none' }}>
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain"/>
      <img src={beforeSrc} alt="Before"
           className="absolute inset-0 h-full w-full object-contain"
           style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}/>
      <div className="absolute top-0 bottom-0"
           style={{ left: `${pos}%`, width: 2, background: BRAND.charcoal }}/>
      <div className="absolute bottom-2 left-3 right-3">
        <input type="range" min={0} max={100} value={pos}
               onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full"/>
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
  const MAX = maxMB || 12;
  if (!f) return "Invalid file.";
  if (!f.type.startsWith("image/")) return "Please upload an image file.";
  if (f.size > MAX*1024*1024) return `Image too large. Please keep it under ${MAX}MB.`;
  return null;
}
async function safeReadText(res){ try{return await res.text();}catch{return "";} }
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

/* ---------------- Upload + Result ---------------- */
function UploadAndResult(){
  const [file,setFile]=useState(null);
  const [previewUrl,setPreviewUrl]=useState(null);
  const [resultUrl,setResultUrl]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [progress,setProgress]=useState(0);
  const [imgW,setImgW]=useState(0); const [imgH,setImgH]=useState(0);
  const controllerRef=useRef(null);

  const [panelH, setPanelH] = useState(640);

  useEffect(() => {
    const setH = () => {
      setPanelH(Math.round(Math.max(520, Math.min(820, window.innerHeight*0.72))));
    };
    setH();
    window.addEventListener('resize', setH);
    return () => window.removeEventListener('resize', setH);
  }, []);

  const handleFile = async (f) => {
    setError(null);
    const err = validateImageFile(f,12);
    if (err){ setError(err); return; }
    const url = URL.createObjectURL(f);
    setFile(f); setResultUrl(null); setPreviewUrl(url);
    try{ const {w,h} = await readImageSize(url); setImgW(w); setImgH(h);}catch{}
  };

  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setResultUrl(null); setError(null); };

  const groom=async()=>{
    if(!file) return;
    setLoading(true); setProgress(12);
    controllerRef.current=new AbortController();
    try{
      const form=new FormData();
      form.append("image",file);
      form.append("dog_only","true");
      if (imgW && imgH){ form.append("target_w",String(imgW)); form.append("target_h",String(imgH)); }
      const res=await fetch("/api/groom",{method:"POST",body:form,signal:controllerRef.current.signal});
      setProgress(60);
      if(!res.ok) throw new Error(await safeReadText(res)||`Backend error ${res.status}`);
      const data=await res.json();
      const url=pickResultUrl(data);
      if(!url) throw new Error("No image returned.");
      setResultUrl(url);
      setProgress(100);
    }catch(e){ setError(e.message); }
    finally{ setLoading(false); }
  };

  return (
    <section id="app" className="container mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl bg-white shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600">Upload a dog photo → AI grooms → compare before & after</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-charcoal" href={resultUrl} download><Icon.Download/> Download</a>
        ) : <div className="h-9"/>}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload */}
        <Card className="p-4">
          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border border-dashed border-slate-300 cursor-pointer hover:bg-white"
                   style={{ height: panelH }}>
              <div className="grid place-items-center gap-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white grid place-items-center shadow">
                  <Icon.Upload/>
                </div>
                <div className="font-medium">Drag & drop or click to upload</div>
                <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden"
                     onChange={(e)=>handleFile(e.target.files[0])}/>
            </label>
          ) : (
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden bg-slate-50" style={{height:panelH}}>
                <img src={previewUrl} alt="Uploaded" className="h-full w-full object-contain"/>
              </div>
              <div className="mt-3 h-14 flex gap-3">
                {!loading ? (
                  <>
                    <Button className="btn-charcoal" onClick={groom}><Icon.Wand/> Groom</Button>
                    <Button className="btn-outline-charcoal" onClick={resetAll}><Icon.Reset/> Reset</Button>
                  </>
                ) : (
                  <Button className="btn-charcoal" disabled><Icon.Wand/> Working… {progress}%</Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Result */}
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Groomed dog using hornet</div>
          <div className="rounded-2xl overflow-hidden" style={{height:panelH}}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center border border-dashed bg-slate-50/60 text-sm text-slate-600">
                Your groomed image will appear here.
              </div>
            ) : <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl}/>}
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Hero ---------------- */
function Hero(){
  return (
    <header className="text-white" style={{ backgroundColor: BRAND.charcoal }}>
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6 inline-block">
            Joyzze
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Make your dog look freshly groomed</h1>
          <p className="mt-4 text-slate-300 max-w-xl">Upload → groom → compare before & after.</p>
          <div className="mt-6 flex gap-3">
            <a href="#app" className="btn btn-charcoal !bg-white !text-gray-900 hover:!bg-slate-100">Try it free</a>
            <a href="#how" className="btn btn-outline-charcoal text-white">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img src="/dog-4.jpg" alt="Hero" className="w-full h-auto"/>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Samples ---------------- */
function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 mb-10">Only grooming changes, everything else stays identical.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {["dog-1.jpg","dog-2.jpg","dog-3.jpg"].map((src,i)=>(
          <div key={i} className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
            <img src={`/${src}`} alt={`Sample ${i+1}`} className="w-full h-auto object-cover"/>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer(){
  return (
    <footer className="text-slate-200" style={{ backgroundColor: BRAND.charcoal }}>
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="flex items-start gap-3">
          <img src="/dog-5.png" alt="logo" className="w-8 h-8 rounded-2xl bg-white"/>
          <div>
            <div className="font-semibold">Joyzze</div>
            <p className="text-sm text-slate-400">AI grooming preview—only a neater dog.</p>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li><a href="#how">How it works</a></li>
            <li><a href="#examples">Examples</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Joyzze. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */
export default function Page(){
  return (
    <main>
      <style jsx global>{`
        .btn { display:inline-flex; align-items:center; gap:.5rem; padding:.55rem 1rem; border-radius:.7rem; font-weight:600; transition:all .15s; }
        .btn-charcoal{ background:${BRAND.charcoal}; color:#fff; border:1px solid ${BRAND.charcoal}; }
        .btn-charcoal:hover{ background:${BRAND.charcoalHover}; border-color:${BRAND.charcoalHover}; }
        .btn-outline-charcoal{ color:#fff; background:transparent; border:1px solid rgba(255,255,255,.25); }
        .btn-outline-charcoal:hover{ background:rgba(255,255,255,.08); }
        .card{ background:#fff; border-radius:1rem; box-shadow:0 10px 30px rgba(0,0,0,.06); border:1px solid #e5e7eb; }
      `}</style>
      <Hero/>
      <UploadAndResult/>
      <Samples/>
      <Footer/>
    </main>
  );
}
