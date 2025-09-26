'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------- Small SVG icons ---------------- */
const Icon = {
  Upload: (props) => (
    <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Wand: (props) => (
    <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),

  Reset: (props) => (
    <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),

  Download: (props) => (
    <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

/* ---------------- Small UI helpers ---------------- */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-medium transition-all ${
      disabled
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700 text-white shadow"
    } ${className}`}
  >
    {children}
  </button>
);

const Card = ({ className="", children }) => (
  <div className={`rounded-2xl bg-white shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

/* ---------------- Compare slider ---------------- */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none">
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false}/>
      <img
        src={beforeSrc}
        alt="Before"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(168,85,247,0.9)' }} />
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
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve({w: img.naturalWidth, h: img.naturalHeight});
    img.onerror=reject;
    img.src=url;
  });
}

/* =========================================================
   Upload + Result
   ========================================================= */
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
    setError(null);
    const validationError = validateImageFile(f, 12);
    if (validationError){ setError(validationError); return; }
    const url = URL.createObjectURL(f);
    setFile(f); setResultUrl(null); setPreviewUrl(url);
  };
  const selectFile=(e)=>{ const f=e?.target?.files?.[0]; if(f)handleFile(f); };

  const resetAll=()=>{ setFile(null); setPreviewUrl(null); setResultUrl(null); setError(null); };

  const groom=()=>{ 
    if (!previewUrl) return;
    setResultUrl(previewUrl); // For demo: just mirrors preview
  };

  return (
    <section id="app" className="container mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5 shadow"/>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">Joyzze-Dog Groomer</h1>
            <p className="text-xs md:text-sm text-slate-600">
              Upload a dog photo → AI grooms the dog → compare before &amp; after
            </p>
          </div>
        </div>
        {resultUrl ? (
          <a className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow flex items-center gap-2" href={resultUrl} download>
            <Icon.Download /> Download
          </a>
        ) : <div className="h-9" />}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <Card className="p-4">
          {!previewUrl && error && (
            <div className="mb-4 rounded-2xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">{String(error)}</div>
          )}

          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border border-dashed border-slate-300 text-center cursor-pointer hover:bg-slate-50" style={{ height: panelH }}>
              <div className="grid place-items-center gap-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white grid place-items-center shadow">
                  <Icon.Upload />
                </div>
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
                <Button onClick={groom}><Icon.Wand /> Groom</Button>
                <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={resetAll}><Icon.Reset /> Reset</Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Groomed dog result</div>
          <div className="rounded-2xl overflow-hidden" style={{ height: panelH }}>
            {!resultUrl ? (
              <div className="h-full grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 text-sm text-slate-600">
                Your groomed image will appear here.
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

/* ---------------- Header ---------------- */
function Header() {
  return (
    <header className="bg-[#1a1a2e] text-white">
      <div className="flex justify-between items-center px-6 py-2 text-sm">
        <span>(877) 456-9993</span>
        <span>info@joyzze.com</span>
      </div>
      <nav className="bg-[#2c2c38]">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
              <span className="text-2xl">J</span> Joyzze
            </div>
            <ul className="hidden md:flex gap-6 text-sm">
              <li><a href="#" className="hover:text-purple-400">All Products</a></li>
              <li><a href="#" className="hover:text-purple-400">Clippers</a></li>
              <li><a href="#" className="hover:text-purple-400">Blades</a></li>
              <li><a href="#" className="hover:text-purple-400">Combs & Accessories</a></li>
              <li><a href="#" className="hover:text-purple-400">Information</a></li>
              <li><a href="#" className="hover:text-purple-400">Recycling & Sharpening</a></li>
              <li><a href="#" className="hover:text-purple-400">Distributor</a></li>
            </ul>
          </div>
          <input type="text" placeholder="Search..." className="px-3 py-2 rounded-md text-black text-sm"/>
        </div>
      </nav>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero(){
  return (
    <header className="relative overflow-hidden bg-[#323030] text-white">
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">
            Joyzze
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-indigo-300">with AI</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>.
            Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow">Try it free</a>
            <a href="#how" className="px-4 py-2 rounded-xl bg-gray-800 text-white border border-white/20">See how it works</a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img src="/dog-10.png" alt="Hero sample" className="w-full h-auto object-cover" />
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
        Upload your photo → AI grooms the dog → compare before &amp; after.
      </p>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[220px]">
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600">We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.</p>
        </Card>
        <Card className="p-6 flex flex-col min-h-[220px]">
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600">Use the slider to compare before/after. Download the result in one click.</p>
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

/* ---------------- Footer ---------------- */
function Footer(){
  return (
    <footer className="bg-[#323030] text-slate-200">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white">All Products</a></li>
            <li><a href="#" className="hover:text-white">Clippers</a></li>
            <li><a href="#" className="hover:text-white">Blades</a></li>
            <li><a href="#" className="hover:text-white">Combs & Accessories</a></li>
            <li><a href="#" className="hover:text-white">Information</a></li>
            <li><a href="#" className="hover:text-white">Recycling & Sharpening</a></li>
            <li><a href="#" className="hover:text-white">Distributor</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Series</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white">A-Series</a></li>
            <li><a href="#" className="hover:text-white">C-Series</a></li>
            <li><a href="#" className="hover:text-white">D-Series</a></li>
            <li><a href="#" className="hover:text-white">M-Series</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Subscribe to our Newsletter</div>
          <div className="flex">
            <input type="email" placeholder="Email address..." className="px-3 py-2 rounded-l-md text-black text-sm w-full"/>
            <button className="px-4 py-2 bg-purple-600 rounded-r-md">→</button>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <p className="text-sm text-slate-400">Joy of Grooming Made Easy™</p>
          <p className="text-sm text-slate-400">(877) 456-9993</p>
          <p className="text-sm text-slate-400">info@joyzze.com</p>
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
      <Header />
      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <Footer />
    </main>
  );
}
