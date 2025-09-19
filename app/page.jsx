'use client';

import React, { useEffect, useRef, useState } from 'react';

/* =========================================================
   Small helpers
   ========================================================= */
const Button = ({ className = '', disabled, onClick, children, type = 'button' }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`btn ${className}`}>
    {children}
  </button>
);

const Card = ({ className = '', children }) => (
  <div className={`card ${className}`}>{children}</div>
);

/** Keep a box at a fixed aspect ratio (used so both panels match exactly) */
function AspectBox({ aspect = 4 / 5, children }) {
  const paddingTop = `${(1 / aspect) * 100}%`;
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white">
      <div className="relative w-full" style={{ paddingTop }}>
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}

/** Simple inline icons you already used */
const Icon = {
  Upload: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 12V3m0 0L9 6m3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M20 16.5a3.5 3.5 0 0 0-2.5-3.36A5.5 5.5 0 0 0 7 11a4 4 0 0 0-1 7.87"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Wand: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 18 18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Reset: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M20 10a8 8 0 0 0-14.73-3.5M4 14a8 8 0 0 0 14.73 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  Download: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

/* =========================================================
   Utilities
   ========================================================= */
function pickResultUrl(data) {
  if (data && typeof data === 'object') {
    if (typeof data.image === 'string' && data.image.length) {
      return data.image.startsWith('data:') ? data.image : `data:image/png;base64,${data.image}`;
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
  if (!type.startsWith('image/')) return 'Please upload an image file.';
  if (size > MAX * 1024 * 1024) return `Image too large. Please keep it under ${MAX}MB.`;
  return null;
}
async function safeReadText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
function readImageSize(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

/* =========================================================
   Compare Slider
   ========================================================= */
function CompareSlider({ beforeSrc, afterSrc, aspect }) {
  const [pos, setPos] = useState(55);
  return (
    <div className="h-full flex flex-col">
      {/* Image area (keeps aspect) */}
      <AspectBox aspect={aspect || 4 / 5}>
        <img src={afterSrc} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <img
          src={beforeSrc}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          draggable={false}
        />
        {/* Divider */}
        <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'rgba(79,70,229,0.9)' }} />
      </AspectBox>

      {/* Slider control */}
      <div className="pt-3">
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value) || 55)}
          className="w-full"
        />
      </div>
    </div>
  );
}

/* =========================================================
   Main App Section (Uploader + Result)
   ========================================================= */
function UploadAndResult() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const controllerRef = useRef(null);

  // computed aspect to keep both panels identical
  const aspect = imgH ? imgW / imgH : 4 / 5;

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (resultUrl && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFile = async (f) => {
    setError(null);
    const validationError = validateImageFile(f, 12);
    if (validationError) {
      setError(validationError);
      return;
    }
    const url = URL.createObjectURL(f);
    setFile(f);
    setResultUrl(null);
    setPreviewUrl(url);
    try {
      const { w, h } = await readImageSize(url);
      setImgW(w);
      setImgH(h);
    } catch {
      /* fall back to default aspect */
    }
  };

  const selectFile = (e) => {
    const f = e?.target?.files?.[0];
    if (f) handleFile(f);
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setProgress(0);
    setError(null);
  };

  const groom = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(12);
    controllerRef.current = new AbortController();

    try {
      const form = new FormData();
      form.append('image', file);
      form.append('dog_only', 'true');
      if (imgW && imgH) {
        form.append('target_w', String(imgW));
        form.append('target_h', String(imgH));
      }

      const res = await fetch('/api/groom', { method: 'POST', body: form, signal: controllerRef.current?.signal });
      setProgress(60);
      if (!res.ok) {
        const msg = await safeReadText(res);
        throw new Error(msg || `Backend error (${res.status})`);
      }
      const data = await res.json();
      const url = pickResultUrl(data);
      if (!url) throw new Error('Unexpected response from backend.');
      setResultUrl(url);
      setProgress(100);
    } catch (e) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  return (
    <section id="app" className="container mx-auto px-6 py-10">
      {/* Top bar: brand + title on left, download button on the far right */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          {/* Your favicon image instead of the scissor icon */}
          <img
            src="/dog-5.jpg"
            alt="Brand"
            className="w-10 h-10 rounded-2xl object-cover shadow"
          />
          <div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight">Joyzze-Dog Groomer</h1>
            <p className="text-sm text-slate-600">
              Upload a dog photo → AI grooms the dog → compare before &amp; after
            </p>
          </div>
        </div>

        {resultUrl ? (
          <a className="btn btn-primary" href={resultUrl} download>
            <Icon.Download /> Download
          </a>
        ) : (
          <span />
        )}
      </div>

      {/* Two equal-height columns */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* LEFT — Upload/Preview */}
        <Card className="p-6">
          {error && (
            <div className="mb-4 rounded-2xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">
              {String(error)}
            </div>
          )}

          {!previewUrl ? (
            <label className="block rounded-3xl border border-dashed border-slate-300 p-6 text-center cursor-pointer hover:bg-white">
              <AspectBox aspect={aspect}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-white grid place-items-center shadow text-slate-600">
                    <Icon.Upload />
                  </div>
                  <div className="font-medium">Drag &amp; drop or click to upload</div>
                  <div className="text-xs text-slate-600">PNG, JPG up to 12MB</div>
                </div>
              </AspectBox>
              <input type="file" accept="image/*" className="hidden" onChange={selectFile} />
            </label>
          ) : (
            <div>
              <AspectBox aspect={aspect}>
                <img src={previewUrl} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
              </AspectBox>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!loading ? (
                  <>
                    <Button className="btn-primary" onClick={groom}>
                      <Icon.Wand /> Groom
                    </Button>
                    <Button className="btn-ghost" onClick={resetAll}>
                      <Icon.Reset /> Reset
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn-primary" disabled>
                      <Icon.Wand /> Working… {progress}%
                    </Button>
                    <Button className="btn-ghost" onClick={cancel}>
                      <Icon.Reset /> Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* RIGHT — Result (keeps same size as left with same AspectBox/aspect) */}
        <Card className="p-6">
          {/* Small heading above the result, as requested */}
          <h2 className="text-lg font-semibold mb-3">Groomed dog using hornet</h2>

          {!resultUrl ? (
            <AspectBox aspect={aspect}>
              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-slate-300/70 bg-slate-50/60 flex items-center justify-center text-sm text-slate-600 p-6 text-center">
                Your groomed image will appear here. After processing, use the slider to compare before/after.
              </div>
            </AspectBox>
          ) : (
            <CompareSlider beforeSrc={previewUrl} afterSrc={resultUrl} aspect={aspect} />
          )}
        </Card>
      </div>
    </section>
  );
}

/* =========================================================
   Hero (unchanged visually)
   ========================================================= */
function Hero() {
  return (
    <header className="relative overflow-hidden bg-[#0d1324] text-white">
      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 mb-6">
            Joyzze
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Make your dog look freshly groomed—<span className="text-indigo-300">with AI</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Upload a photo, we tidy fur and outline while keeping the <b>breed, pose, background, lighting, and colors
            identical</b>. Compare before &amp; after with a slider.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#app" className="btn btn-primary !bg-rose-500 hover:!bg-rose-600">
              Try it free
            </a>
            {/* No hover tint on purpose */}
            <a
              href="#how"
              className="btn text-white border border-white/20 bg-[#121a2b] hover:bg-[#121a2b] focus:bg-[#121a2b] active:bg-[#121a2b] focus:outline-none"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img src="/dog-4.jpg" alt="Hero sample" className="w-full h-auto object-cover" />
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   3 steps (buttons aligned)
   ========================================================= */
function HowItWorks() {
  return (
    <section id="how" className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl font-semibold mb-2">Three simple steps</h2>
      <p className="text-center text-slate-600 mb-10">
        Upload your photo → AI grooms the dog → compare before &amp; after.
      </p>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center text-xs mb-3">1</div>
          <h3 className="font-semibold mb-1">Upload a dog photo</h3>
          <p className="text-sm text-slate-600">PNG or JPG up to ~12MB. Works best with a clear subject.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">
              Upload now
            </a>
          </div>
        </Card>

        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center text-xs mb-3">2</div>
          <h3 className="font-semibold mb-1">Let AI groom</h3>
          <p className="text-sm text-slate-600">
            We tidy fur around face and paws for a neat, cleaned look—while keeping everything else unchanged.
          </p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">
              Start grooming
            </a>
          </div>
        </Card>

        <Card className="p-6 flex flex-col min-h-[220px]">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center text-xs mb-3">3</div>
          <h3 className="font-semibold mb-1">Compare &amp; download</h3>
          <p className="text-sm text-slate-600">Use the slider to compare before/after. Download the result in one click.</p>
          <div className="mt-auto pt-4">
            <a href="#app" className="btn btn-primary inline-flex w-[140px] justify-center">
              Try the slider
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* =========================================================
   Samples + Footer (unchanged)
   ========================================================= */
function Samples() {
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

function Footer() {
  return (
    <footer className="bg-[#0d1324] text-slate-200">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/dog-5.jpg" alt="Brand" className="w-8 h-8 rounded-2xl object-cover shadow" />
            <div className="font-semibold">Joyzze</div>
          </div>
          <p className="text-sm text-slate-400">AI grooming preview that keeps everything identical—only a neater dog.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>
              <a href="#how" className="hover:text-white">
                How it works
              </a>
            </li>
            <li>
              <a href="#examples" className="hover:text-white">
                Examples
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>
              <a className="hover:text-white">Terms</a>
            </li>
            <li>
              <a className="hover:text-white">Privacy</a>
            </li>
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

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
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
