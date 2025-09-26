'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, PawPrint, Scissors, Image as ImageIcon } from 'lucide-react';

/* ---------------- Small SVG icons ---------------- */
const Icon = {
  Upload: (props) => <PawPrint className="w-6 h-6 text-purple-500" {...props} />,
  Wand: (props) => <Scissors className="w-6 h-6 text-purple-500" {...props} />,
  Reset: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  Download: (props) => <ImageIcon className="w-5 h-5 text-purple-500" {...props} />,
};

/* ---------------- Small UI helpers ---------------- */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-medium transition shadow ${className}`}
  >
    {children}
  </button>
);

const Card = ({ className="", children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`rounded-3xl bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition ${className}`}
  >
    {children}
  </motion.div>
);

/* ---------------- Compare slider ---------------- */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 select-none">
      <img src={afterSrc} alt="After" className="absolute inset-0 h-full w-full object-contain" />
      <img src={beforeSrc} alt="Before" className="absolute inset-0 h-full w-full object-contain" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(139,92,246,0.9)' }} />
      <div className="absolute bottom-2 left-3 right-3">
        <input type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full accent-purple-500" />
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
async function padToSize(dataUrl, targetW, targetH) {
  const img = new Image(); img.src = dataUrl; await new Promise(r => (img.onload = r));
  const canvas = document.createElement("canvas"); canvas.width = targetW; canvas.height = targetH;
  const ctx = canvas.getContext("2d"); ctx.clearRect(0,0,targetW,targetH);
  const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
  const nw = Math.round(img.naturalWidth * scale); const nh = Math.round(img.naturalHeight * scale);
  const dx = Math.floor((targetW - nw) / 2); const dy = Math.floor((targetH - nh) / 2);
  ctx.drawImage(img, dx, dy, nw, nh); return canvas.toDataURL("image/png");
}

/* ---------------- Upload & Result ---------------- */
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
    const setH = () => {
      setPanelH(Math.round(Math.max(520, Math.min(820, window.innerHeight * 0.72))));
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
    <section id="app" className="container mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="/dog-5.png" alt="logo" className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400/50" />
          <div>
            <h1 className="text-3xl font-bold">Joyzze Dog Groomer</h1>
            <p className="text-sm text-slate-500">Upload → AI grooms → Compare</p>
          </div>
        </div>
        {resultUrl && (
          <a className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center gap-2" href={resultUrl} download>
            <Icon.Download /> Download
          </a>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Upload Panel */}
        <Card className="p-6">
          {!previewUrl ? (
            <label className="grid place-items-center rounded-2xl border-2 border-dashed border-purple-400/50 bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer hover:border-purple-500" style={{ height: panelH }}>
              <div className="flex flex-col items-center gap-3">
                <Icon.Upload />
                <div className="font-medium">Drag & drop or click to upload</div>
                <div className="text-xs text-slate-500">PNG, JPG up to 12MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile} />
            </label>
          ) : (
            <div className="flex flex-col h-full">
              <div className="rounded-2xl overflow-hidden bg-slate-50" style={{ height: panelH }}>
                <img src={previewUrl} alt="Uploaded" className="h-full w-full object-contain" />
              </div>
              <div className="mt-4 flex gap-3">
                {!loading ? (
                  <>
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white" onClick={groom}><Icon.Wand /> Groom</Button>
                    <Button className="bg-slate-200 hover:bg-slate-300" onClick={resetAll}><Icon.Reset /> Reset</Button>
                  </>
                ) : (
                  <>
                    <Button className="bg-purple-400 text-white" disabled>Working… {progress}%</Button>
                    <Button className="bg-slate-200 hover:bg-slate-300" onClick={cancel}><Icon.Reset /> Cancel</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Result Panel */}
        <Card className="p-6">
          <div className="mb-2 text-sm font-semibold">Groomed Dog Result</div>
          <div className="rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center" style={{ height: panelH }}>
            {!resultUrl ? (
              <p className="text-slate-500 text-sm text-center">Your groomed image will appear here.</p>
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
function SigninHeader() {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white text-xs px-6 py-2 flex justify-between">
        <span>(877) 456-9993</span>
        <span>info@joyzze.com</span>
      </div>
      <div className="bg-[#1e1e2f] text-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/dog-5.png" alt="logo" className="w-10 h-10 rounded-full ring-2 ring-purple-400/40" />
            <span className="font-extrabold text-xl bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">Joyzze</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            {['All Products','Clippers','Blades','Combs & Accessories','Information','Recycling & Sharpening','Distributor'].map((item, i)=>(
              <a key={i} href="#" className="relative group hover:text-purple-300">
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          <div className="relative">
            <input type="text" placeholder="Search..." className="px-4 py-2 rounded-full text-sm text-black shadow-inner focus:ring-2 focus:ring-purple-400 outline-none"/>
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500"/>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero(){
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1e1e2f] via-[#2a2438] to-[#1e1e2f] text-white">
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.7}}>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">Joyzze</div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Make your dog look<br/>
            <span className="bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              freshly groomed—with AI
            </span>
          </h1>
          <p className="mt-6 text-slate-300 max-w-xl text-lg">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>. 
            Compare before & after with a slider.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#app" className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-lg hover:scale-105 transition">Try it free</a>
            <a href="#how" className="px-6 py-3 rounded-full border border-purple-400/50 text-white font-medium shadow hover:bg-white/10 transition">See how it works</a>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} transition={{duration:0.8}} className="rounded-3xl overflow-hidden shadow-2xl ring-2 ring-purple-400/20 hover:scale-105 transition">
          <img src="/dog-10.png" alt="Hero sample" className="w-full h-auto object-cover"/>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Steps ---------------- */
function HowItWorks() {
  return (
    <section id="how" className="bg-gradient-to-b from-slate-50 to-slate-100 py-20">
      <h2 className="text-center text-3xl font-bold mb-4">Three Simple Steps</h2>
      <p className="text-center text-slate-600 mb-12">Upload → AI grooms → Compare</p>
      <div className="container mx-auto grid md:grid-cols-3 gap-8 px-6">
        {[
          {title:"Upload a dog photo",desc:"PNG or JPG up to 12MB. Works best with a clear subject.",btn:"Upload now"},
          {title:"Let AI groom",desc:"We tidy fur around face and paws for a neat look.",btn:"Start grooming"},
          {title:"Compare & download",desc:"Use the slider to compare before/after and save.",btn:"Try the slider"},
        ].map((s,i)=>(
          <Card key={i} className="p-6 flex flex-col">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white grid place-items-center text-lg mb-4">{i+1}</div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600 flex-grow">{s.desc}</p>
            <div className="mt-4"><a href="#app" className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm shadow">{s.btn}</a></div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Samples ---------------- */
function Samples(){
  return (
    <section id="examples" className="container mx-auto px-6 py-20">
      <h2 className="text-center text-3xl font-bold mb-4">Sample Results</h2>
      <p className="text-center text-slate-600 mb-12">Background, breed, pose, lighting and colors stay identical—only grooming changes.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {['/dog-1.jpg','/dog-2.jpg','/dog-3.jpg'].map((src,i)=>(
          <motion.div whileHover={{scale:1.05}} key={i} className="rounded-3xl overflow-hidden shadow-lg ring-1 ring-slate-200">
            <img src={src} alt={`Sample ${i+1}`} className="w-full h-auto object-cover"/>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function SigninFooter() {
  return (
    <footer className="bg-[#1e1e2f] text-slate-200">
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <h4 className="font-semibold mb-3">Links</h4>
          <ul className="space-y-1 text-sm text-slate-400">
            {['All Products','Clippers','Blades','Combs & Accessories','Information','Recycling & Sharpening','Distributor'].map((l,i)=>(<li key={i}><a href="#" className="hover:text-white">{l}</a></li>))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Series</h4>
          <ul className="space-y-1 text-sm text-slate-400">
            {['A-Series','C-Series','D-Series','M-Series'].map((l,i)=>(<li key={i}><a href="#" className="hover:text-white">{l}</a></li>))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <form className="flex">
            <input type="email" placeholder="Email address..." className="px-3 py-2 w-full rounded-l text-black text-sm"/>
            <button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-r text-white text-sm">→</button>
          </form>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm text-slate-400">Joy of Grooming Made Easy™</p>
          <p className="text-sm text-slate-400">(877) 456-9993</p>
          <p className="text-sm text-slate-400">info@joyzze.com</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4 text-xs text-slate-400 flex justify-between items-center">
          <span>© {new Date().getFullYear()} Joyzze. All rights reserved.</span>
          <div className="flex space-x-4">
            <a href="#"><img src="/icon-fb.svg" className="w-4 h-4"/></a>
            <a href="#"><img src="/icon-ig.svg" className="w-4 h-4"/></a>
            <a href="#"><img src="/icon-tt.svg" className="w-4 h-4"/></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */
export default function Page(){
  return (
    <main>
      <SigninHeader />
      <Hero />
      <HowItWorks />
      <UploadAndResult />
      <Samples />
      <SigninFooter />
    </main>
  );
}
