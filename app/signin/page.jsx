'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaSpinner } from 'react-icons/fa'; // Make sure to install react-icons: npm install react-icons

const BRAND = {
  charcoal: '#2f2f31',
  blue: '#4285F4',
};

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleGoogle() {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('from') || '/';
      await signIn('google', { callbackUrl: to });
    } finally {
      setLoading(false);
    }
  }

  async function handleCredentials(e) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      alert('Sign-in failed. Please check your credentials.');
    } else {
      router.push(result.url || '/');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 font-sans">
      
      {/* Centered Sign-in card */}
      <section className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10 transform transition-transform duration-500 ease-in-out hover:scale-[1.01]">
        <div className="flex flex-col items-center gap-4 mb-6 text-center">
          <img
            src="/dog-5.png"
            alt="Joyzze logo"
            className="w-16 h-16 rounded-3xl object-cover ring-1 ring-black/5"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to continue to your account.</p>
          </div>
        </div>

        {/* Email and Password Form */}
        <form onSubmit={handleCredentials} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ backgroundColor: BRAND.charcoal }}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Continue with Email'}
          </button>
        </form>

        {/* Separator */}
        <div className="my-8 flex items-center before:flex-1 before:border-t before:border-gray-300 before:content-[''] after:flex-1 after:border-t after:border-gray-300 after:content-['']">
          <p className="mx-4 text-center text-sm text-gray-500">or</p>
        </div>

        {/* Google Sign-in Button */}
        <button
          className="w-full h-12 rounded-xl text-gray-700 bg-white border border-gray-300 font-semibold shadow-sm hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          onClick={handleGoogle}
          disabled={loading}
        >
          <FaGoogle style={{ color: BRAND.blue }} />
          {loading ? <FaSpinner className="animate-spin" /> : 'Sign in with Google'}
        </button>

      </section>

      {/* Footer pinned to bottom */}
      <footer
        className="fixed bottom-0 w-full text-xs text-white p-4 text-center"
        style={{ backgroundColor: BRAND.charcoal }}
      >
        <span>Joyzze · Joy of Grooming Made Easy™</span>
        <span>© {new Date().getFullYear()} Joyzze. All rights reserved.</span>
      </footer>
    </main>
  );
}
