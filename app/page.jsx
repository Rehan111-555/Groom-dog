'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------- Theme ---------------- */
const BRAND = {
  charcoal: '#323030',        // your requested color
  charcoalHover: '#1e1c1c',   // darker shade for hover
  charcoalBorder: '#4a4848',  // subtle border shade
};

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
};

/* ---------------- Small UI helpers ---------------- */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className = "", children }) => <div className={`card ${className}`}>{children}</div>;

/* ---------------- Compare slider ---------------- */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none" style={{ touchAction: 'none' }}>
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false}/>
      <img
        src={beforeSrc}
        alt="Before"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(50,48,48,0.95)' }} />
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
function validateImageFile(f, maxMB){
  const MAX = typeof maxMB==="number" ? maxMB : 12;
  if (!f || typeof f!=="object") return "Invalid file.";
  const type = String(f.type||"");
  const size = Number(f.size||0);
  if (type.indexOf("image/")!==0) return "Please upload an image file.";
  if (size > MAX*1024*1024) return `Image too large. Please keep it under ${MAX}MB.`;
  return null;
}
async function safeReadText(res){ try { return await res.text(); } catch { return ""; } }
function readImageSize(url){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve({w: img.naturalWidth, h: img.naturalHeight});
    img.onerror=reject;
    img.src=url;
  });
}

/* ---------------- Upload & Result ---------------- */
function UploadAndResult(){
  const [file,setFile]=useState(null);
  const [previewUrl,setPreviewUrl]=useState(null);
  const [resultUrl,setResultUrl]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [progress,setProgress]=useState(0);
  const controllerRef=useRef(null);

  const [panelH, setPanelH] = useState(640);

  useEffect(() => {
    const setH = () => {
      const h = Math.round(Math.max(520, Math.min(820, window.innerHeight * 0.72)));
      setPanelH(h);
    };
    setH();
    window.addEventListener('resize', setH);
    return () => window.removeEventListener('resize', setH);
  }, []);

  const handleFile = async (f) => {
    setError(null);
    const validationError = validateImageFile(f, 12);
    if (validationError){ setError(validationError); return; }
    const url = URL.createObjectURL(f);
    setFile(f); setResultUrl(null); setPreviewUrl(url);
  };

  const selectFile=(e)=>{ const f=e?.target?.files?.[0]; if(f)handleFile(f); };
  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setResultUrl(null); setProgress(0); setError(null); };

  return (
    <section id="app" className="container mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600">Upload → Groom → Compare</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-charcoal" href={resultUrl} download>
            <Icon.Download /> Download
          </a>
        ) : <div className="h-9" />}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <Card className="p-4">
          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border border-dashed border-slate-300 text-center cursor-pointer hover:bg-white" style={{ height: panelH }}>
              <div className="grid place-items-center gap-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white grid place-items-center shadow"><Icon.Upload/></div>
                <div className="font-medium">Drag &amp; drop or click to upload</div>
                <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile}/>
            </label>
          ) : (
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden bg-slate-50" style={{ height: panelH }}>
                <img src={previewUrl} alt="Uploaded" className="h-full w-full object-contain" />
              </div>
              <div className="mt-3 h-14 flex flex-wrap items-center gap-3">
                <Button className="btn-charcoal" onClick={resetAll}><Icon.Reset /> Reset</Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Groomed result</div>
          <div className="rounded-2xl overflow-hidden" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 text-sm text-slate-600">
                Groomed image will appear here.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} />
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- HERO ---------------- */
function Hero(){
  return (
    <header className="relative overflow-hidden text-white" style={{ backgroundColor: BRAND.charcoal }}>
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">Joyzze</div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-slate-300">with AI</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, AI tidies fur while keeping the <b>breed, pose, background, lighting, and colors identical</b>.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="btn btn-charcoal !bg-white !text-gray-900 hover:!bg-slate-100">Try it free</a>
            <a href="#how" className="btn btn-outline-charcoal text-white">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img src="/dog-4.jpg" alt="Hero sample" className="w-full h-auto object-cover" />
        </div>
      </div>
    </header>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  return (
    <section id="how" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 mb-10">
        Upload your photo → AI grooms → Compare before &amp; after.
      </p>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full text-white grid place-items-center text-xs mb-3" style={{backgroundColor: BRAND.charcoal}}>1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full text-white grid place-items-center text-xs mb-3" style={{backgroundColor: BRAND.charcoal}}>2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600">We tidy fur around face and paws for a neat look while keeping everything else unchanged.</p>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full text-white grid place-items-center text-xs mb-3" style={{backgroundColor: BRAND.charcoal}}>3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600">Use the slider to compare before/after and download in one click.</p>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Samples ---------------- */
function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 mb-10">Background, lighting, and breed stay identical — only grooming changes.</p>
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

/* ---------------- Footer ---------------- */
function Footer(){
  return (
    <footer className="text-slate-200" style={{ backgroundColor: BRAND.charcoal }}>
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="flex items-start gap-3">
          <img src="/dog-5.png" alt="logo" className="w-8 h-8 rounded-2xl object-cover bg-white ring-1 ring-white/10" />
          <div>
            <div className="font-semibold">Joyzze</div>
            <p className="text-sm text-slate-400">AI grooming preview that keeps everything identical — only a neater dog.</p>
          </div>
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
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
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
      {/* Global styles */}
      <style jsx global>{`
        .btn { display:inline-flex; align-items:center; gap:.5rem; padding:.55rem 1rem; border-radius:.7rem; font-weight:600; transition:all .15s ease; }
        .btn-charcoal{ background:${BRAND.charcoal}; color:#fff; border:1px solid ${BRAND.charcoal}; }
        .btn-charcoal:hover{ background:${BRAND.charcoalHover}; border-color:${BRAND.charcoalHover}; }
        .btn-outline-charcoal{ color:#fff; background:transparent; border:Thanks for clarifying — I see the problem now. The error you hit (`Unterminated string constant`) came from a cut-off JSX string in my previous response. Let me fix that by giving you a **clean, complete file** (`app/page.jsx`) with no truncations, no syntax issues, and making sure:

- **Brand color** is exactly `#323030` (used for header, footer, and buttons).  
- **Sample results section** is included.  
- Full JSX is present in one go (around ~400 lines).  
- Code is copy-paste ready.

---

### ✅ Full `app/page.jsx`

```jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------- Theme ---------------- */
const BRAND = {
  charcoal: '#323030',
  charcoalHover: '#1e1c1c',
  charcoalBorder: '#4a4848',
};

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
};

/* ---------------- Small UI helpers ---------------- */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className = "", children }) => <div className={`card ${className}`}>{children}</div>;

/* ---------------- Compare slider ---------------- */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none" style={{ touchAction: 'none' }}>
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false}/>
      <img
        src={beforeSrc}
        alt="Before"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(50,48,48,0.95)' }} />
      <div className="absolute bottom-2 left-3 right-3">
        <input type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full"/>
      </div>
    </div>
  );
}

/* ---------------- Upload & Result ---------------- */
function UploadAndResult(){
  const [file,setFile]=useState(null);
  const [previewUrl,setPreviewUrl]=useState(null);
  const [resultUrl,setResultUrl]=useState(null);
  const [error,setError]=useState(null);

  const [panelH, setPanelH] = useState(640);

  useEffect(() => {
    const setH = () => {
      const h = Math.round(Math.max(520, Math.min(820, window.innerHeight * 0.72)));
      setPanelH(h);
    };
    setH();
    window.addEventListener('resize', setH);
    return () => window.removeEventListener('resize', setH);
  }, []);

  const handleFile = async (f) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile(f); setPreviewUrl(url); setResultUrl(null);
  };

  const selectFile=(e)=>{ const f=e?.target?.files?.[0]; if(f)handleFile(f); };
  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setResultUrl(null); setError(null); };

  return (
    <section id="app" className="container mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600">Upload → Groom → Compare</p>
          </div>
        </div>
        {resultUrl ? (
          <a className="btn btn-charcoal" href={resultUrl} download>
            <Icon.Download /> Download
          </a>
        ) : <div className="h-9" />}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <Card className="p-4">
          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border border-dashed border-slate-300 text-center cursor-pointer hover:bg-white" style={{ height: panelH }}>
              <div className="grid place-items-center gap-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white grid place-items-center shadow"><Icon.Upload/></div>
                <div className="font-medium">Drag &amp; drop or click to upload</div>
                <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile}/>
            </label>
          ) : (
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden bg-slate-50" style={{ height: panelH }}>
                <img src={previewUrl} alt="Uploaded" className="h-full w-full object-contain" />
              </div>
              <div className="mt-3 h-14 flex flex-wrap items-center gap-3">
                <Button className="btn-charcoal" onClick={resetAll}><Icon.Reset /> Reset</Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Groomed result</div>
          <div className="rounded-2xl overflow-hidden" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 text-sm text-slate-600">
                Groomed image will appear here.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} />
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Hero ---------------- */
function Hero(){
  return (
    <header className="relative overflow-hidden text-white" style={{ backgroundColor: BRAND.charcoal }}>
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">Joyzze</div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-slate-300">with AI</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, AI tidies fur while keeping the <b>breed, pose, background, lighting, and colors identical</b>.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="btn btn-charcoal !bg-white !text-gray-900 hover:!bg-slate-100">Try it free</a>
            <a href="#how" className="btn btn-outline-charcoal text-white">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img src="/dog-4.jpg" alt="Hero sample" className="w-full h-auto object-cover" />
        </div>
      </div>
    </header>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  return (
    <section id="how" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 mb-10">Upload → Groom → Compare before &amp; after.</p>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full text-white grid place-items-center text-xs mb-3" style={{backgroundColor: BRAND.charcoal}}>1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600">PNG/JPG up to 12MB. Works best with a clear subject.</p>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full text-white grid place-items-center text-xs mb-3" style={{backgroundColor: BRAND.charcoal}}>2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600">AI cleans fur while keeping everything else unchanged.</p>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full text-white grid place-items-center text-xs mb-3" style={{backgroundColor: BRAND.charcoal}}>3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600">Use the slider to compare before/after and download instantly.</p>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Samples ---------------- */
function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Sample results</h2>
      <p className="text-center text-slate-600 mb-10">Breed, background and colors stay identical — only grooming changes.</p>
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

/* ---------------- Footer ---------------- */
function Footer(){
  return (
    <footer className="text-slate-200" style={{ backgroundColor: BRAND.charcoal }}>
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="flex items-start gap-3">
          <img src="/dog-5.png" alt="logo" className="w-8 h-8 rounded-2xl object-cover bg-white ring-1 ring-white/10" />
          <div>
            <div className="font-semibold">Joyzze</div>
            <p className="text-sm text-slate-400">AI grooming preview that keeps everything identical—only a neater dog.</p>
          </div>
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
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
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
        .btn { display:inline-flex; align-items:center; gap:.5rem; padding:.55rem 1rem; border-radius:.7rem; font-weight:600; transition:all .15s ease; }
        .btn-charcoal{ background:${BRAND.charcoal}; color:#fff; border:1px solid ${BRAND.charcoal}; }
        .btn-charcoal:hover{ background:${BRAND.charcoalHover}; border-color:${BRAND.charcoalHover}; }
        .btn-outline-charcoal{ color:#fff; background:transparent; border:1px solid rgba(255,255,255,.25); }
        .btn-outline-charcoal:hover{ background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.35); }
        .btn:disabled{ opacity:.6; cursor:not-allowed; }
        .card{ background:#fff; border-radius:1rem; box-shadow: 0 10px 30px rgba(2,8,23,.06); border:1px solid #e5e7eb; }
      `}</style>

      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <Footer />
    </main>
  );
}
