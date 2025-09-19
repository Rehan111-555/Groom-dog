'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ========= Icons ========= */
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
  Scissors: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20 4 7 17m13 3L7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

/* ========= Small UI helpers ========= */
const Button = ({ className = '', disabled, onClick, children, type = 'button' }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>
    {children}
  </button>
);
const Card = ({ className = '', children }) => <div className={`card ${className}`}>{children}</div>;
function classNames(...a) { return a.filter(Boolean).join(' '); }

/* ========= Slider (before/after) ========= */
function CompareSlider({ beforeSrc, afterSrc, aspect }) {
  const [pos, setPos] = useState(55);
  const paddingTop = aspect > 0 ? `${(1 / aspect) * 100}%` : '62%';
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow" style={{ background: '#f8fafc' }}>
      <div className="relative w-full" style={{ paddingTop }}>
        <img src={afterSrc} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
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
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value) || 55)} className="w-full" />
      </div>
    </div>
  );
}

/* ========= Utils ========= */
function pickResultUrl(data) {
  if (data && typeof data === 'object') {
    if (typeof data.image === 'string' && data.image.length) {
      return data.image.indexOf('data:') === 0 ? data.image : `data:image/png;base64,${data.image}`;
    }
    if (typeof data.url === 'string' && data.url.length) return data.url;
  }
  return null;
}
function validateImageFile(f, maxMB) {
  const MAX = typeof maxMB === 'number' ? maxMB : 12;
  if (!f || typeof f !== 'object') return 'Invalid file.';
  const type = String(f.type || '');
  const size = Number(f.size || 0);
  if (type.indexOf('image/') !== 0) return 'Please upload an image file.';
  if (size > MAX * 1024 * 1024) return `Image too large. Please keep it under ${MAX}MB.`;
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
  const img = new Image(); img.src = dataUrl; await new Promise((r) => (img.onload = r));
  const canvas = document.createElement('canvas'); canvas.width = targetW; canvas.height = targetH;
  const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, targetW, targetH);
  const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
  const nw = Math.round(img.naturalWidth * scale); const nh = Math.round(img.naturalHeight * scale);
  const dx = Math.floor((targetW - nw) / 2); const dy = Math.floor((targetH - nh) / 2);
  ctx.drawImage(img, dx, dy, nw, nh); return canvas.toDataURL('image/png');
}

/* ========= Hidden default prompt (sent to server) ========= */
const DEFAULT_PROMPT =
  "Groom the dog in this image so it looks freshly cleaned and well-trimmed, while keeping everything else in the photo exactly the same. Do not alter the background, lighting, colors, or any other details besides the dog's grooming.";

/* ========= Upload + Result (with hidden prompt) ========= */
function UploadAndResult() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const controllerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl?.startsWith?.('blob:')) URL.revokeObjectURL(resultUrl);
  }, [previewUrl, resultUrl]);

  const handleFile = async (f) => {
    setError(null);
    const v = validateImageFile(f, 12);
    if (v) { setError(v); return; }
    const url = URL.createObjectURL(f);
    setFile(f); setFileName(f.name); setResultUrl(null); setPreviewUrl(url);
    try { const { w, h } = await readImageSize(url); setImgW(w); setImgH(h); } catch {}
  };

  const onInput = (e) => { const f = e.target.files?.[0]; if (f) handleFile(f); };
  const onDrop = (evt) => { evt.preventDefault(); const f = evt.dataTransfer?.files?.[0]; if (f) handleFile(f); };

  const resetAll = () => { setFile(null); setFileName(''); setPreviewUrl(null); setResultUrl(null); setProgress(0); setError(null); };

  const groom = async () => {
    if (!file) return;
    setLoading(true); setError(null); setProgress(12);
    controllerRef.current = new AbortController();
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('prompt', DEFAULT_PROMPT);             // HIDDEN prompt
      form.append('dog_only', 'true');
      if (imgW && imgH) { form.append('target_w', String(imgW)); form.append('target_h', String(imgH)); }

      const res = await fetch('/api/groom', { method: 'POST', body: form, signal: controllerRef.current?.signal });
      setProgress(60);
      if (!res.ok) { const msg = await safeReadText(res); throw new Error(msg || `Backend error (${res.status})`); }

      const data = await res.json();
      const url = pickResultUrl(data);
      if (!url) throw new Error('Unexpected response from backend.');
      try {
        const { w, h } = await readImageSize(url);
        if (imgW && imgH && (w !== imgW || h !== imgH)) { const padded = await padToSize(url, imgW, imgH); setResultUrl(padded); }
        else { setResultUrl(url); }
      } catch { setResultUrl(url); }
      setProgress(100);
    } catch (e) { setError(e?.message || 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  const aspect = imgH ? (imgW / imgH) : 0;
  const disableGroom = !file || loading;

  return (
    <section id="start" className="py-12">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-8 items-start">
        {/* Upload */}
        <div
          className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {error && <div className="mb-4 rounded-xl px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200">{String(error)}</div>}

          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 grid place-items-center text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-50 grid place-items-center shadow-sm text-slate-600 mb-4">
              <Icon.Upload />
            </div>
            <div className="font-medium mb-1">Drag &amp; drop or click to upload</div>
            <div className="text-xs text-slate-500 mb-6">PNG, JPG up to 12MB</div>

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInput} />
            <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 shadow">
              <Icon.Upload /> Choose image
            </button>

            {fileName && <div className="mt-4 text-xs text-slate-600">Selected: <span className="font-medium">{fileName}</span></div>}
          </div>

          {previewUrl && (
            <div className="mt-6">
              <img src={previewUrl} alt="Uploaded" className="w-full rounded-2xl shadow border border-slate-200 max-h-[70vh] object-contain bg-slate-50" />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              disabled={disableGroom}
              onClick={groom}
              className={classNames(
                'inline-flex items-center gap-2 rounded-xl text-sm px-4 py-2 shadow',
                disableGroom ? 'bg-indigo-300 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              )}
            >
              <Icon.Wand /> {loading ? `Working… ${progress}%` : 'Groom'}
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-xl text-sm px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50"
            >
              <Icon.Reset /> Reset
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Result</h3>
            {resultUrl && (
              <a className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 shadow" href={resultUrl} download="groomed.png">
                <Icon.Download /> Download
              </a>
            )}
          </div>

          {!resultUrl ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center text-sm text-slate-500 bg-slate-50/60">
              Your groomed image will appear here. After processing, use the slider to compare before/after.
            </div>
          ) : (
            <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} aspect={aspect} />
          )}
        </div>
      </div>
    </section>
  );
}

/* ========= Page ========= */
export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0B1220] to-[#0e1424]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20">
          <nav className="flex items-center justify-between text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="inline-grid place-items-center w-8 h-8 rounded-xl bg-indigo-600 text-white">
                <Icon.Scissors />
              </span>
              <span className="font-semibold text-white">Dog Groomer</span>
            </div>
            <ul className="hidden md:flex gap-6">
              <li><a href="#how" className="hover:text-white">How it works</a></li>
              <li><a href="#examples" className="hover:text-white">Examples</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </nav>

          <div className="mt-14 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-white/10 text-slate-200 ring-1 ring-white/10 mb-4">
                FLASH 2.5 • IMAGE PREVIEW
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Make your dog look freshly groomed—with AI
              </h1>
              <p className="mt-4 text-slate-300 max-w-xl">
                Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background,
                lighting, and colors identical</b>. Compare before &amp; after with a slider.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#start" className="inline-flex items-center rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 shadow">
                  Try it free
                </a>
                <a href="#how" className="inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 ring-1 ring-white/10">
                  See how it works
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] bg-white/5 ring-1 ring-white/10 overflow-hidden">
                {/* hero image from public/dog-1.jpg */}
                <img src="/dog-1.jpg" alt="Happy dog at the beach" className="w-full h-[420px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Steps */}
      <section id="how" className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-semibold mb-1">Three simple steps</h2>
          <p className="text-center text-sm text-slate-600 mb-8">
            Upload your photo → AI grooms the dog → compare before &amp; after.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-xs w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 grid place-items-center mb-3">1</div>
              <h3 className="font-semibold mb-1">Upload a dog photo</h3>
              <p className="text-sm text-slate-600 mb-4">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
              <a href="#start" className="btn btn-primary text-xs">Upload now</a>
            </Card>

            <Card className="p-6">
              <div className="text-xs w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 grid place-items-center mb-3">2</div>
              <h3 className="font-semibold mb-1">Let AI groom</h3>
              <p className="text-sm text-slate-600 mb-4">
                We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.
              </p>
              <a href="#start" className="btn btn-primary text-xs">Start grooming</a>
            </Card>

            <Card className="p-6">
              <div className="text-xs w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 grid place-items-center mb-3">3</div>
              <h3 className="font-semibold mb-1">Compare &amp; download</h3>
              <p className="text-sm text-slate-600 mb-4">
                Use the slider to compare before/after. Download the result in one click.
              </p>
              <a href="#start" className="btn btn-primary text-xs">Try the slider</a>
            </Card>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-semibold mb-1">Sample results</h2>
          <p className="text-center text-sm text-slate-600 mb-8">
            Background, breed, pose, lighting and colors stay identical—only grooming changes.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-white">
              <img src="/dog-2.jpg" alt="Dog example 1" className="w-full h-[230px] object-cover" />
            </div>
            <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-white">
              <img src="/dog-3.jpg" alt="Dog example 2" className="w-full h-[230px] object-cover" />
            </div>
            <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-white">
              <img src="/dog-4.jpg" alt="Dog example 3" className="w-full h-[230px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 md:p-8 flex items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">Ready to groom your photo?</h3>
              <p className="text-sm text-slate-600">Upload a dog photo, and compare the result in seconds.</p>
            </div>
            <a href="#start" className="inline-flex items-center rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 shadow">
              Get started
            </a>
          </div>
        </div>
      </section>

      {/* Upload/Result */}
      <UploadAndResult />

      {/* Footer */}
      <footer className="bg-[#0b1220] text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-grid place-items-center w-8 h-8 rounded-xl bg-indigo-600 text-white">
                <Icon.Scissors />
              </span>
              <span className="font-semibold text-white">Dog Groomer</span>
            </div>
            <p className="text-sm text-slate-400">
              AI grooming preview that keeps everything identical—only a neater dog.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#how" className="hover:text-white">How it works</a></li>
              <li><a href="#examples" className="hover:text-white">Examples</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white" href="#">Terms</a></li>
              <li><a className="hover:text-white" href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-slate-500 border-t border-white/5 py-4 text-center">
          © {new Date().getFullYear()} Dog Groomer. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
