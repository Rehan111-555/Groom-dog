
'use client';
import React, { useCallback, useEffect, useRef, useState } from "react";

/* Icons */
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

/* Primitives */
const Button = ({ className = "", disabled, onClick, children, type = "button" }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>{children}</button>
);
const Card = ({ className="", children }) => <div className={`card ${className}`}>{children}</div>;

/* Slider */
function CompareSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-soft">
      <div className="relative w-full" style={{ paddingTop: "62%" }}>
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
function pickResultUrl(data){ if(data&&typeof data==="object"){ if(typeof data.image==="string"&&data.image.length){ return data.image.indexOf("data:")===0?data.image:`data:image/png;base64,${data.image}`;} if(typeof data.url==="string"&&data.url.length)return data.url;} return null;}
function validateImageFile(f,maxMB){ var MAX=typeof maxMB==="number"?maxMB:12; if(!f||typeof f!=="object")return "Invalid file."; var type=String(f.type||""); var size=Number(f.size||0); if(type.indexOf("image/")!==0)return "Please upload an image file."; if(size>MAX*1024*1024)return "Image too large. Please keep it under "+MAX+"MB."; return null;}
async function safeReadText(res){ try{return await res.text();}catch(e){return "";}}

export default function App(){
  const [file,setFile]=useState(null);
  const [previewUrl,setPreviewUrl]=useState(null);
  const [resultUrl,setResultUrl]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [prompt,setPrompt]=useState("Groom the dog in this image so it looks freshly cleaned and well-trimmed, while keeping everything else in the photo exactly the same. Do not alter the background, lighting, colors, or any other details besides the dog's grooming.");
  const [progress,setProgress]=useState(0);
  const controllerRef=useRef(null);

  useEffect(()=>()=>{ if(previewUrl)URL.revokeObjectURL(previewUrl); if(resultUrl?.startsWith?.("blob:"))URL.revokeObjectURL(resultUrl); },[previewUrl,resultUrl]);

  const onDrop=useCallback((evt)=>{ evt.preventDefault(); const f=evt.dataTransfer?.files?.[0]; if(f)handleFile(f); },[]);

  const handleFile=(f)=>{
    setError(null);
    const validationError=validateImageFile(f,12);
    if(validationError){ setError(validationError); return; }
    setFile(f); setResultUrl(null); setPreviewUrl(URL.createObjectURL(f));
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
      form.append("prompt",prompt);
      form.append("dog_only","true");
      const res=await fetch("/api/groom",{ method:"POST", body:form, signal:controllerRef.current?.signal });
      setProgress(60);
      if(!res.ok){ const msg=await safeReadText(res); throw new Error(msg||`Backend error (${res.status})`); }
      const data=await res.json();
      const url=pickResultUrl(data);
      if(!url) throw new Error("Unexpected response from backend.");
      setResultUrl(url); setProgress(100);
    }catch(e){ setError(e?.message||"Something went wrong."); }
    finally{ setLoading(false); }
  };

  const cancel=()=>{ controllerRef.current?.abort(); setLoading(false); };

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white grid place-items-center shadow-soft">
          <Icon.Scissors />
        </div>
        <div>
          <div className="badge mb-1">Flash 2.5</div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">Dog Groomer</h1>
          <p className="text-sm text-slate-600">Upload a dog photo → AI grooms the dog → compare before & after</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Upload & Controls */}
        <Card className="p-6">
          {error && <div className="mb-4 rounded-2xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">{String(error)}</div>}
          {!previewUrl ? (
            <label className="block rounded-3xl border border-dashed border-slate-300 p-12 text-center cursor-pointer hover:bg-white">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white grid place-items-center shadow-soft mb-4">
                <Icon.Upload />
              </div>
              <div className="font-medium mb-1">Drag & drop or click to upload</div>
              <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile} />
            </label>
          ) : (
            <div className="space-y-6">
              <img src={previewUrl} alt="Uploaded" className="w-full rounded-2xl shadow-soft" />
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Prompt</label>
                <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} rows={3}
                  className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100" />
              </div>
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

        {/* Result */}
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
              <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
