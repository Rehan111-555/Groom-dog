'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

// Define a consistent color palette for the design
const BRAND_COLORS = {
  primary: '#2f2f31',
  googleRed: '#DB4437',
  inputBg: '#f8f9fa',
  placeholder: '#a0a0a0',
};

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen flex flex-col bg-gray-100 font-sans">

      {/* Header */}
      <header className="w-full text-xs text-white" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/dog-5.png" width={24} height={24} alt="Joyzze" className="rounded-full" />
            <span>Joyzze — Dog Groomer</span>
          </div>
          <a href="https://joyzze.com" className="opacity-80 hover:opacity-100 transition-opacity">joyzze.com</a>
        </div>
      </header>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">

          {/* Sign-in Card */}
          <section className="bg-white rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-[1.01]">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Welcome Back</h1>
              <p className="text-sm text-gray-500 mt-2">Sign in to continue to your account</p>
            </div>

            {/* Email and Password Form */}
            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-md px-4 text-sm bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 mt-1"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-md px-4 text-sm bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 mt-1"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-md text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                style={{ backgroundColor: BRAND_COLORS.primary }}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Sign in with Email'}
              </button>
            </form>

            {/* Separator */}
            <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-300 before:content-[''] after:flex-1 after:border-t after:border-gray-300 after:content-['']">
              <p className="mx-4 text-center text-sm text-gray-500">OR</p>
            </div>

            {/* Google Sign-in Button */}
            <button
              className="w-full h-11 rounded-md text-gray-700 bg-white border border-gray-300 font-semibold shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              onClick={handleGoogle}
              disabled={loading}
            >
              <FaGoogle className="text-xl" style={{ color: BRAND_COLORS.googleRed }} />
              <span className="text-sm">Sign in with Google</span>
            </button>
          </section>

          {/* Optional Footer/Legal Text */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <footer
        className="w-full text-xs text-white p-4 text-center"
        style={{ backgroundColor: BRAND_COLORS.primary }}
      >
        <span>Joyzze · Joy of Grooming Made Easy™</span>
        <span className="block mt-1">© {new Date().getFullYear()} Joyzze. All rights reserved.</span>
      </footer>
    </main>
  );
}
