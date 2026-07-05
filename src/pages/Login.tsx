import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between p-6 bg-grid-pattern bg-primary transition-colors duration-300 relative safe-bottom-padding">
      
      {/* ThemeToggle automatically rendered absolute fixed here */}
      <ThemeToggle />

      {/* Top Header */}
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <Link to="/" className="text-xl font-bold font-sans tracking-tight text-primary flex items-center gap-2">
          <span>✨</span>
          <span>JordanLinks</span>
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center py-10 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-primary border border-primary p-6 sm:p-8 rounded-3xl shadow-sm mx-4 sm:mx-0"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-sans text-primary">
              Welcome back
            </h1>
            <p className="text-secondary text-sm">
              Log in to manage your creator space
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-3 rounded-xl border border-primary bg-transparent text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-indigo transition-shadow text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-primary bg-transparent text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-indigo transition-shadow text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary border border-primary text-primary font-bold rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <hr className="w-full border-primary" />
            <span className="absolute px-3 bg-primary text-xs text-secondary uppercase tracking-wider">
              or
            </span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 bg-secondary border border-primary text-primary font-semibold rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.78 0 3.38.61 4.64 1.8l3.46-3.46C17.99 1.19 15.2 0 12 0 7.35 0 3.37 2.67 1.48 6.56l4.03 3.13C6.46 6.87 8.99 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.9c2.18-2.01 3.7-4.99 3.7-8.72z"
              />
              <path
                fill="#FBBC05"
                d="M5.51 14.31c-.25-.72-.39-1.5-.39-2.31s.14-1.59.39-2.31L1.48 6.56C.54 8.5.01 10.69.01 13c0 2.31.53 4.5 1.47 6.44l4.03-3.13z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.07 7.96-2.92l-3.73-2.9c-1.1.74-2.51 1.18-4.23 1.18-3.01 0-5.54-1.83-6.49-4.65l-4.03 3.13C3.37 21.33 7.35 24 12 24z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-accent-indigo hover:underline">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-secondary font-sans max-w-5xl mx-auto w-full">
        &copy; {new Date().getFullYear()} JordanLinks. All rights reserved.
      </footer>
    </div>
  );
};
export default Login;
