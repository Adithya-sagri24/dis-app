import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/Button';

export const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Fix: Use signInWithPassword to align with Supabase v2 API.
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Fix: The `signUp` method is correct for Supabase v2. The original error was likely a cascade from other type errors.
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert('Check your email for the confirmation link!');
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    // Fix: Use signInWithOAuth to align with Supabase v2 API.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
    // Note: setLoading(false) is not called here because the page will redirect.
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              You Decide
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Sign in to continue.
            </p>
        </header>
        <div className="p-8 bg-slate-800 rounded-xl shadow-lg">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="mt-6 space-y-4">
                <Button onClick={handleLogin} disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button onClick={handleSignUp} disabled={loading} className="!bg-gray-600 hover:!bg-gray-700 focus:!ring-gray-400">
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
            </div>
            {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </form>

            <div className="flex items-center text-center my-6">
                <hr className="flex-grow border-slate-600" />
                <span className="px-4 text-gray-400 font-medium text-sm">OR</span>
                <hr className="flex-grow border-slate-600" />
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
               className="!bg-white hover:!bg-gray-200 !text-gray-800"
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                  className="mr-3"
                >
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                </svg>
                <span className="font-medium">Sign in with Google</span>
              </div>
            </Button>
        </div>
      </div>
    </div>
  );
};