import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Check, X, Loader2 } from 'lucide-react';
import { db, doc, getDoc, setDoc, collection, query, where, getDocs } from '../firebase';

export const Register: React.FC = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameError, setUsernameError] = useState('');

  // Google Onboarding State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [showGoogleOnboarding, setShowGoogleOnboarding] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      setUsernameError('');
      return;
    }

    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    if (!regex.test(username)) {
      setUsernameStatus('invalid');
      setUsernameError('3-16 characters. Letters, numbers, - or _ only.');
      return;
    }

    setUsernameStatus('checking');
    setUsernameError('');

    const delayDebounceFn = setTimeout(async () => {
      try {
        const lowerUsername = username.toLowerCase();
        const userDocRef = doc(db, 'users', lowerUsername);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUsernameStatus('taken');
          setUsernameError('Username is already claimed.');
        } else {
          setUsernameStatus('available');
        }
      } catch (err) {
        console.error("Error checking username uniqueness:", err);
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available') {
      setError('Please choose an available username.');
      return;
    }
    if (!email || !password || !username) return;

    setError('');
    setLoading(true);

    try {
      // 1. Create Auth account
      const credential = await signUpWithEmail(email, password, username);
      const user = credential.user;

      // 2. Create user profile in Firestore
      const lowerUsername = username.toLowerCase();
      await setDoc(doc(db, 'users', lowerUsername), {
        uid: user.uid,
        username: lowerUsername,
        displayName: username,
        bio: '',
        pfpUrl: user.photoURL || '',
        email: email,
        socials: {
          instagram: '',
          youtube: '',
          tiktok: '',
          twitter: ''
        },
        links: [],
        views: 0
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const credential = await signInWithGoogle();
      const user = credential.user;

      // Check if user already has a claimed username profile
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User already onboarded, send to dashboard
        navigate('/dashboard');
      } else {
        // User needs to select a username
        setGoogleUser(user);
        setShowGoogleOnboarding(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available' || !googleUser) return;

    setError('');
    setLoading(true);

    try {
      const lowerUsername = username.toLowerCase();
      await setDoc(doc(db, 'users', lowerUsername), {
        uid: googleUser.uid,
        username: lowerUsername,
        displayName: googleUser.displayName || username,
        bio: '',
        pfpUrl: googleUser.photoURL || '',
        email: googleUser.email || '',
        socials: {
          instagram: '',
          youtube: '',
          tiktok: '',
          twitter: ''
        },
        links: [],
        views: 0
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Failed to claim username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between p-6 bg-grid-pattern bg-primary transition-colors duration-300 relative safe-bottom-padding">
      
      {/* Absolute positioning ThemeToggle automatically overlays here */}
      <ThemeToggle />

      <header className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <Link to="/" className="text-xl font-bold font-sans tracking-tight text-primary flex items-center gap-2">
          <span>✨</span>
          <span>JordanLinks</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-10 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-primary border border-primary p-6 sm:p-8 rounded-3xl shadow-sm mx-4 sm:mx-0"
        >
          <AnimatePresence mode="wait">
            {!showGoogleOnboarding ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-sans text-primary">
                    Create your space
                  </h1>
                  <p className="text-secondary text-sm">
                    Build your custom creator page in seconds
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
                      Choose Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-secondary text-sm select-none">
                        jordanworld.co/links/
                      </span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                        placeholder="username"
                        className="w-full pl-[165px] pr-10 py-3 rounded-xl border border-primary bg-transparent text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-indigo transition-shadow text-base"
                      />
                      <div className="absolute right-3 top-3.5">
                        {usernameStatus === 'checking' && (
                          <Loader2 className="h-4.5 w-4.5 text-accent-indigo animate-spin" />
                        )}
                        {usernameStatus === 'available' && (
                          <Check className="h-4.5 w-4.5 text-green-500" />
                        )}
                        {usernameStatus === 'taken' && (
                          <X className="h-4.5 w-4.5 text-red-500" />
                        )}
                        {usernameStatus === 'invalid' && (
                          <X className="h-4.5 w-4.5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    {usernameError && (
                      <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                        {usernameError}
                      </p>
                    )}
                    {usernameStatus === 'available' && (
                      <p className="mt-1.5 text-[11px] text-green-500 font-medium">
                        Username is available!
                      </p>
                    )}
                  </div>

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
                    disabled={loading || usernameStatus !== 'available'}
                    className="w-full py-3.5 bg-primary border border-primary text-primary font-bold rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{loading ? 'Creating space...' : 'Create Account'}</span>
                  </button>
                </form>

                <div className="relative my-6 flex items-center justify-center">
                  <hr className="w-full border-primary" />
                  <span className="absolute px-3 bg-primary text-xs text-secondary uppercase tracking-wider">
                    or
                  </span>
                </div>

                <button
                  onClick={handleGoogleRegister}
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
                  <span>Sign up with Google</span>
                </button>

                <p className="mt-8 text-center text-sm text-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-accent-indigo hover:underline">
                    Log in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="google-onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-sans text-primary">
                    Claim your handle
                  </h1>
                  <p className="text-secondary text-sm">
                    Enter a unique username to complete your space
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleGoogleOnboardSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-secondary text-sm select-none">
                        jordanworld.co/links/
                      </span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                        placeholder="username"
                        className="w-full pl-[165px] pr-10 py-3 rounded-xl border border-primary bg-transparent text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-indigo transition-shadow text-base"
                      />
                      <div className="absolute right-3 top-3.5">
                        {usernameStatus === 'checking' && (
                          <Loader2 className="h-4.5 w-4.5 text-accent-indigo animate-spin" />
                        )}
                        {usernameStatus === 'available' && (
                          <Check className="h-4.5 w-4.5 text-green-500" />
                        )}
                        {usernameStatus === 'taken' && (
                          <X className="h-4.5 w-4.5 text-red-500" />
                        )}
                        {usernameStatus === 'invalid' && (
                          <X className="h-4.5 w-4.5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    {usernameError && (
                      <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                        {usernameError}
                      </p>
                    )}
                    {usernameStatus === 'available' && (
                      <p className="mt-1.5 text-[11px] text-green-500 font-medium">
                        Username is available!
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || usernameStatus !== 'available'}
                    className="w-full py-3.5 bg-primary border border-primary text-primary font-bold rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
                  >
                    <span>Claim Handle & Continue</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="text-center py-4 text-xs text-secondary font-sans max-w-5xl mx-auto w-full">
        &copy; {new Date().getFullYear()} JordanLinks. All rights reserved.
      </footer>
    </div>
  );
};
export default Register;
