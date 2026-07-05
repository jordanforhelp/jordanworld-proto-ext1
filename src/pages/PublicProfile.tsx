import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc, updateDoc } from '../firebase';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ExternalLink, 
  Loader2,
  ChevronLeft,
  Search
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  clicks?: number;
}

interface Socials {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
}

interface ProfileData {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  pfpUrl: string;
  email: string;
  socials: Socials;
  links: LinkItem[];
  views?: number;
}

export const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Scroll Parallax Hooks (with GPU-accelerated spring curves)
  const { scrollY } = useScroll();
  const headerScale = useTransform(scrollY, [0, 150], [1, 0.85]);
  const headerY = useTransform(scrollY, [0, 150], [0, 10]);
  const headerOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  // Fetch profile data from Firestore
  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const lowerUsername = username.toLowerCase();
        const userDocRef = doc(db, 'users', lowerUsername);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          const currentViews = data.views || 0;
          await updateDoc(userDocRef, { views: currentViews + 1 });
          setProfile({ ...data, views: currentViews + 1 });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleLinkClick = async (linkId: string, url: string) => {
    if (!profile || !username) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Open link immediately for responsive user experience
    window.open(url, '_blank', 'noopener,noreferrer');

    try {
      const lowerUsername = username.toLowerCase();
      const userDocRef = doc(db, 'users', lowerUsername);

      const updatedLinks = profile.links.map(link => {
        if (link.id === linkId) {
          return { ...link, clicks: (link.clicks || 0) + 1 };
        }
        return link;
      });

      // Update state locally
      setProfile({
        ...profile,
        links: updatedLinks
      });

      // Write back to Firestore
      await updateDoc(userDocRef, { links: updatedLinks });
    } catch (err) {
      console.error('Error tracking link click:', err);
    }
  };

  // Bold, Standardized w-12 h-12 Social Icon SVG Elements
  const InstagramIcon = () => (
    <svg className="h-12 w-12 fill-current aspect-square object-contain" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );

  const YoutubeIcon = () => (
    <svg className="h-12 w-12 fill-current aspect-square object-contain" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  const TiktokIcon = () => (
    <svg className="h-12 w-12 fill-current aspect-square object-contain" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.39v7.91c.02 3.44-2.24 6.78-5.63 7.39-3.71.79-7.6-1.57-8.4-5.26-.88-3.78 1.34-7.9 5.16-8.79.99-.25 2.03-.23 3.03-.02v4.19c-.83-.24-1.74-.23-2.54.14-1.55.67-2.43 2.5-1.92 4.13.48 1.69 2.25 2.74 3.96 2.37 1.61-.31 2.72-1.84 2.66-3.48V0h.08z"/>
    </svg>
  );

  const XIcon = () => (
    <svg className="h-11 w-11 fill-current aspect-square object-contain" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const MailIcon = () => (
    <svg className="h-12 w-12 fill-none stroke-current stroke-2 aspect-square object-contain" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  // Framer Motion Variants (with spring physics)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 85, damping: 14 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-primary">
        <Loader2 className="h-8 w-8 text-accent-indigo animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-dvh flex flex-col justify-between p-6 bg-grid-pattern bg-primary transition-colors duration-300">
        <header className="flex justify-between items-center max-w-2xl mx-auto w-full">
          <Link to="/" className="text-xl font-bold font-sans tracking-tight text-primary flex items-center gap-2">
            <span>✨</span>
            <span>JordanLinks</span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="p-4 bg-secondary rounded-full mb-6 border border-primary">
            <Search className="h-8 w-8 text-secondary opacity-60" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-primary">
            Space Not Found
          </h1>
          <p className="text-secondary text-sm max-w-sm mb-8 leading-relaxed">
            The profile page for <strong className="text-primary">@{username}</strong> does not exist or has been deleted.
          </p>
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3.5 bg-primary border border-primary hover:bg-secondary text-primary text-xs font-bold rounded-full transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Create jordanworld.co/links/{username}</span>
          </Link>
        </main>

        <footer className="text-center py-4 text-xs text-secondary">
          &copy; {new Date().getFullYear()} JordanLinks
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col justify-between p-6 bg-primary bg-grid-pattern transition-colors duration-300 relative safe-bottom-padding">
      
      {/* Absolute positional accessibility for ThemeToggle */}
      <ThemeToggle />

      {/* Main container */}
      <main className="flex-1 max-w-md mx-auto w-full pt-16 pb-12 flex flex-col items-center">
        
        {/* Parallax Header Section with hardware acceleration */}
        <motion.div 
          style={{ scale: headerScale, opacity: headerOpacity, y: headerY }}
          className="flex flex-col items-center text-center w-full mb-8 z-10 gpu-accelerated"
        >
          {profile.pfpUrl ? (
            <img
              src={profile.pfpUrl}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full object-cover border-[3px] border-primary shadow-md mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`;
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-secondary border-[3px] border-primary shadow-md flex items-center justify-center text-primary font-bold text-2xl uppercase mb-4">
              {profile.username.substring(0, 2)}
            </div>
          )}

          <h1 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
            {profile.displayName || `@${profile.username}`}
          </h1>
          {profile.displayName && (
            <p className="text-xs font-semibold text-secondary mb-3">
              @{profile.username}
            </p>
          )}

          {/* Dynamic Bio */}
          {profile.bio && (
            <p className="text-sm text-secondary max-w-[280px] leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Borderless Floating Oversized w-12 h-12 Social Icons Grid */}
          <div className="flex items-center gap-3.5 mt-6 flex-wrap justify-center">
            {profile.socials.instagram && (
              <motion.a
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                href={`https://instagram.com/${profile.socials.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center text-primary transition-transform duration-300 cursor-pointer"
              >
                <InstagramIcon />
              </motion.a>
            )}
            {profile.socials.youtube && (
              <motion.a
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                href={`https://youtube.com/${profile.socials.youtube}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center text-primary transition-transform duration-300 cursor-pointer"
              >
                <YoutubeIcon />
              </motion.a>
            )}
            {profile.socials.tiktok && (
              <motion.a
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                href={`https://tiktok.com/@${profile.socials.tiktok}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center text-primary transition-transform duration-300 cursor-pointer"
              >
                <TiktokIcon />
              </motion.a>
            )}
            {profile.socials.twitter && (
              <motion.a
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                href={`https://twitter.com/${profile.socials.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center text-primary transition-transform duration-300 cursor-pointer"
              >
                <XIcon />
              </motion.a>
            )}
            {profile.email && (
              <motion.a
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${profile.email}`}
                className="w-12 h-12 flex items-center justify-center text-primary transition-transform duration-300 cursor-pointer"
              >
                <MailIcon />
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Scroll-Triggered Reveals Links List with hardware acceleration */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full space-y-4 px-2 z-20 gpu-accelerated"
        >
          {profile.links.length === 0 ? (
            <div className="py-12 text-center text-xs text-secondary border border-dashed border-primary rounded-2xl">
              No links available yet.
            </div>
          ) : (
            profile.links.map((link) => (
              <motion.div
                key={link.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl border border-primary dark:border-white/[0.05] bg-white dark:bg-white/[0.03] dark:backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-250 cursor-pointer gpu-accelerated"
              >
                <button
                  onClick={() => handleLinkClick(link.id, link.url)}
                  // iOS touch target compliant (height matches 48px area)
                  className="w-full py-4.5 px-5 flex items-center justify-between text-primary group cursor-pointer bg-transparent"
                >
                  <span className="text-sm font-bold truncate pr-6 text-left">
                    {link.title}
                  </span>
                  <div className="w-6 h-6 flex items-center justify-center text-secondary group-hover:text-primary transition-colors flex-shrink-0">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                </button>
              </motion.div>
            ))
          )}
        </motion.div>

      </main>

      {/* Footer / Branding */}
      <footer className="text-center py-4 text-xs text-secondary font-sans flex flex-col gap-2.5 items-center">
        <Link to="/" className="font-bold tracking-widest text-[9px] uppercase hover:text-primary transition-colors">
          ⚡ JordanLinks
        </Link>
      </footer>
    </div>
  );
};
export default PublicProfile;
