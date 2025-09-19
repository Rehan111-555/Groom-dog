'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ========== Icons ========== */
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

/* ========== Small UI helpers ========== */
const Card = ({ className = '', children }) => (
  <div className={`card ${className}`}>{children}</div>
);

/* Slider with kept aspect ratio */
function CompareSlider({ beforeSrc, afterSrc, aspect }) {
  const [pos, setPos] = useState(55);
  const paddingTop = aspect > 0 ? `${(1 / aspect) * 100}%` : '62%';
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow" style={{ background: '#f8fafc' }}>
      <div className="relative w-full" style={{ paddingTop }}>
        <img src={afterSrc} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false}/>
        <img
          src={beforeSrc}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          draggable={false}
        />
        <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(79,70,229,0.9)' }} />
      </div>
      <div className="p-3">
        <input type="range" min={0} max={100} value={pos} onChange={(e)=>setPos(Number(e.target.value)||55)} className="w-full"/>
      </div>
    </div>
  );
}

/* ========== Helpers ========== */
function pickResultUrl(data) {
  if (data && typeof data === 'object') {
    if (typeof data.image === 'string' && data.image.length) {
      return data.image.indexOf('data:') === 0 ? data.image : `data:image/png;base64,${data.image}`;
    }
    if (typeof data.url === 'string' && data.url.length) return data.url;
  }
  return null;
}
function validateImageFile(f, maxMB = 12) {
  if (!f || typeof f !== 'object') return 'Invalid file.';
  const type = String(f.type || '');
  const size = Number(f.size || 0);
  if (!type.startsWith('image/')) return 'Please upload an image file.';
  if (size > maxMB * 1024 * 1024) return `Image too large. Please keep it under ${maxMB}MB.`;
  return null;
}
async function safeReadText(res) { try { return await res.text(); } catch { return ''; } }
function readImageSize(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}
async function padToSize(dataUrl, targetW, targetH) {
  const img = new Image(); img.src = dataUrl; await new Promise(r => (img.onload = r));
  const canvas = document.createElement('canvas'); canvas.width = targetW; canvas.height = targetH;
  const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,targetW,targetH);
  const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
  const nw = Math.round(img.naturalWidth * scale); const nh = Math.round(img.naturalHeight * scale);
  const dx = Math.floor((targetW - nw) / 2); const dy = Math.floor((targetH - nh) / 2);
  ctx.drawImage(img, dx, dy, nw, nh); return canvas.toDataURL('image/png');
}

/* ========== Upload + Result with hidden prompt ========== */
function UploadAndResult() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const fileRef = useRef(null);
  const ctlRef = useRef(null);

  // HIDDEN server-bound prompt (do not render a textarea)
  const HIDDEN_PROMPT =
    'Groom the dog in this image so it looks freshly cleaned and well-trimmed, while keeping everything else in the photo exactly the same. Do not alter the background, lighting, colors, or any other details besides the dogs grooming.';

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (resultUrl && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const resetAll = () => {
    setFile(null);
    setFileName('');
    setPreviewUrl(null);
    setResultUrl(null);
    setProgress(0);
    setError('');
  };

  const handleFile = async (f) => {
    if (!f) return;
    const err = validateImageFile(f, 12);
    if (err) { setError(err); return; }
    setError('');
    resetAll();
    setFile(f);
    setFileName(f.name);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    try {
      const { w, h } = await readImageSize(url);
      setImgW(w); setImgH(h);
    } catch {}
  };

  const onFileInput = (e) => handleFile(e.target.files?.[0]);
  const onDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer?.files?.[0]); };

  const groom = async () => {
    if (!file) return;
    setLoading(true); setError(''); setProgress(12);
    ctlRef.current = new AbortController();
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('prompt', HIDDEN_PROMPT); // hidden prompt sent to server
      form.append('dog_only', 'true');
      if (imgW && imgH) { form.append('target_w', String(imgW)); form.append('target_h', String(imgH)); }

      const res = await fetch('/api/groom', { method: 'POST', body: form, signal: ctlRef.current?.signal });
      setProgress(60);
      if (!res.ok) { const t = await safeReadText(res); throw new Error(t || `HTTP ${res.status}`); }
      const data = await res.json();
      const url = pickResultUrl(data);
      if (!url) throw new Error('Model returned no image.');

      try {
        const { w, h } = await readImageSize(url);
        if (imgW && imgH && (w !== imgW || h !== imgH)) {
          const padded = await padToSize(url, imgW, imgH);
          setResultUrl(padded);
        } else {
          setResultUrl(url);
        }
      } catch {
        setResultUrl(url);
      }
      setProgress(100);
    } catch (e) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => { ctlRef.current?.abort(); setLoading(false); };

  const aspect = imgH ? (imgW / imgH) : 0;

  return (
    <section id="try" className="py-14">
      <div className="container grid lg:grid-cols-2 gap-8 items-start">
        {/* Upload */}
        <Card className="p-6" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
          {error && (
            <div className="mb-4 rounded-xl px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200">
              {String(error)}
            </div>
          )}
          {!previewUrl ? (
            <label className="block rounded-3xl border border-dashed border-slate-300 p-12 text-center cursor-pointer hover:bg-white">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white grid place-items-center shadow mb-4 text-slate-600">
                <Icon.Upload />
              </div>
              <div className="font-medium mb-1">Drag &amp; drop or click to upload</div>
              <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileInput}/>
              <div className="mt-6">
                <button type="button" className="btn btn-indigo" onClick={()=>fileRef.current?.click()}>
                  <Icon.Upload/> Choose image
                </button>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              <img src={previewUrl} alt="Uploaded" className="w-full rounded-2xl shadow"/>
              {/* Hidden prompt is used server-side; no textarea is shown */}
              <div className="flex flex-wrap items-center gap-3">
                {!loading ? (
                  <>
                    <button className="btn btn-indigo" onClick={groom}><Icon.Wand/> Groom</button>
                    <button className="btn btn-ghost" onClick={resetAll}><Icon.Reset/> Reset</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-indigo" disabled><Icon.Wand/> Working… {progress}%</button>
                    <button className="btn btn-ghost" onClick={cancel}><Icon.Reset/> Cancel</button>
                  </>
                )}
              </div>
            </div>
          )}
          {fileName && !previewUrl && (
            <div className="mt-3 text-xs text-slate-500">Selected: {fileName}</div>
          )}
        </Card>

        {/* Result */}
        <div className="lg:sticky lg:top-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Result</h3>
              {resultUrl && (
                <a href={resultUrl} download="groomed.png" className="btn btn-indigo">
                  <Icon.Download/> Download
                </a>
              )}
            </div>
            {!resultUrl ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-600 bg-slate-50/60">
                Your groomed image will appear here. After processing, use the slider to compare before/after.
              </div>
            ) : (
              <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} aspect={aspect}/>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ========== Hero ========== */
function Hero() {
  return (
    <header className="bg-gradient-to-b from-[#0b1222] to-[#0b1222] text-white pt-16 pb-10">
      <div className="container grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge">Flash 2.5 • Image Preview</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly<br/>groomed—<span className="whitespace-nowrap">with AI</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors identical</b>.
            Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#try" className="btn btn-primary">Try it free</a>
            <a href="#steps" className="btn btn-secondary">See how it works</a>
          </div>
        </div>
        <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-xl">
          <img src="/dog-4.jpg" alt="Happy dog at the beach" className="w-full h-auto object-cover"/>
        </div>
      </div>
    </header>
  );
}

/* ========== Three steps (above) ========== */
function ThreeSteps() {
  return (
    <section id="steps" className="py-12 bg-[#f3f6fb]">
      <div className="container">
        <h2 className="text-center text-xl font-semibold mb-1">Three simple steps</h2>
        <p className="text-center text-slate-600 mb-8">
          Upload your photo → AI grooms the dog → compare before &amp; after.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-sm text-slate-500 mb-2">1</div>
            <h3 className="font-semibold mb-2">Upload a dog photo</h3>
            <p className="text-sm text-slate-600 mb-4">
              PNG or JPG up to ~12MB. Works best with a clear subject.
            </p>
            <a href="#try" className="btn btn-indigo">Upload now</a>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-slate-500 mb-2">2</div>
            <h3 className="font-semibold mb-2">Let AI groom</h3>
            <p className="text-sm text-slate-600 mb-4">
              We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.
            </p>
            <a href="#try" className="btn btn-indigo">Start grooming</a>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-slate-500 mb-2">3</div>
            <h3 className="font-semibold mb-2">Compare &amp; download</h3>
            <p className="text-sm text-slate-600 mb-4">
              Use the slider to compare before/after. Download the result in one click.
            </p>
            <a href="#try" className="btn btn-indigo">Try the slider</a>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ========== Sample results (below Upload+Result, before footer) ========== */
function SampleResults() {
  return (
    <section className="py-12 bg-[#f3f6fb]">
      <div className="container">
        <h2 className="text-center text-xl font-semibold mb-1">Sample results</h2>
        <p className="text-center text-slate-600 mb-8">
          Background, breed, pose, lighting and colors stay identical—only grooming changes.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img src="/dog-1.jpg" alt="Dog 1" className="w-full h-auto object-cover"/>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img src="/dog-2.jpg" alt="Dog 2" className="w-full h-auto object-cover"/>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img src="/dog-3.jpg" alt="Dog 3" className="w-full h-auto object-cover"/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== Footer ========== */
function Footer() {
  return (
    <footer className="bg-[#0b1222] text-slate-300 py-10">
      <div className="container grid md:grid-cols-3 gap-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white grid place-items-center shadow">
            <Icon.Scissors/>
          </div>
          <div>
            <div className="font-semibold text-white">Dog Groomer</div>
            <p className="text-sm text-slate-400 mt-1">
              AI grooming preview that keeps everything identical—only a neater dog.
            </p>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-2">Links</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#steps" className="hover:underline">How it works</a></li>
            <li><a href="#try" className="hover:underline">Examples</a></li>
            <li><a href="#try" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-2">Legal</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Terms</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="container border-t border-white/10 mt-8 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} Dog Groomer. All rights reserved.
      </div>
    </footer>
  );
}

/* ========== Page ========== */
export default function Page() {
  return (
    <main>
      <Hero/>
      <ThreeSteps/>
      <UploadAndResult/>
      <SampleResults/>
      <Footer/>
    </main>
  );
}
