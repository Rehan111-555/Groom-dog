'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function SignInPage() {
  const { status } = useSession(); // if you don't use SessionProvider, this will be "unauthenticated" but safe
  const [loading, setLoading] = useState(false);

  // Prefer PNG fallback (browsers can't render .ai)
  const [logoSrc, setLogoSrc] = useState('/dog-6.ai');
  const onLogoError = () => setLogoSrc('/dog-5.png');

  // Read NextAuth's callbackUrl param (NOT "from")
  const [callbackUrl, setCallbackUrl] = useState('/');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get('callbackUrl') || '/');
  }, []);

  async function handleGoogle() {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl }); // First time = creates account
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_700px_at_10%_-10%,#ffffff_0%,#f6f7fb_45%,#eef2f9_100%)]">
      <div className="container mx-auto px-6 py-20 max-w-md">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={logoSrc}
              onError={onLogoError}
              alt="Joyzze logo"
              className="w-10 h-10 rounded-2xl object-cover bg-white ring-1 ring-black/5"
            />
            <div>
              <h1 className="text-2xl font-semibold">Joyzze — Dog Groomer</h1>
              <p className="text-sm text-slate-600">Sign in / Sign up to continue</p>
            </div>
          </div>

          <button
            className="btn btn-primary w-full justify-center"
            onClick={handleGoogle}
            disabled={loading}
          >
            {loading ? 'Connecting…' : 'Continue with Google'}
          </button>

          <p className="mt-3 text-xs text-slate-500">
            First-time users are created automatically after Google confirms your account.
          </p>
        </div>
      </div>
    </main>
  );
}
