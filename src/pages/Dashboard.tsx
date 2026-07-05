import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { PreviewMobile } from '../components/PreviewMobile';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Instagram, 
  Youtube, 
  Twitter, 
  Loader2,
  Save
} from 'lucide-react';
import { db, collection, query, where, getDocs, doc, updateDoc } from '../firebase';
import { themeColors, getThemeHex } from '../utils/theme';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  clicks?: number;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile States
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [pfpUrl, setPfpUrl] = useState('');
  const [email, setEmail] = useState('');
  const [socials, setSocials] = useState({
    instagram: '',
    youtube: '',
    tiktok: '',
    twitter: ''
  });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [views, setViews] = useState(0);

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  // New link form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // No profile found, redirect to register to claim username
          setProfileExists(false);
          setLoading(false);
          navigate('/register');
          return;
        }

        const profileDoc = querySnapshot.docs[0];
        const data = profileDoc.data();

        setUsername(data.username);
        setDisplayName(data.displayName || '');
        setBio(data.bio || '');
        setPfpUrl(data.pfpUrl || '');
        setEmail(data.email || '');
        setLinks(data.links || []);
        setSocials({
          instagram: data.socials?.instagram || '',
          youtube: data.socials?.youtube || '',
          tiktok: data.socials?.tiktok || '',
          twitter: data.socials?.twitter || ''
        });
        setViews(data.views || 0);

        setProfileExists(true);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!username) return;
    setSaving(true);
    setSaveStatus('idle');

    try {
      const userDocRef = doc(db, 'users', username.toLowerCase());
      await updateDoc(userDocRef, {
        displayName,
        bio,
        pfpUrl,
        email,
        socials,
        links
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const profileUrl = `jordanworld.co/links/${username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    // Basic URL parsing
    let formattedUrl = newUrl;
    if (!/^https?:\/\//i.test(newUrl)) {
      formattedUrl = `https://${newUrl}`;
    }

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newTitle,
      url: formattedUrl,
      clicks: 0
    };

    setLinks([...links, newLink]);
    setNewTitle('');
    setNewUrl('');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleLinkChange = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(
      links.map(link => {
        if (link.id === id) {
          return { ...link, [field]: value };
        }
        return link;
      })
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-primary">
        <Loader2 className="h-8 w-8 text-accent-indigo animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-secondary transition-colors duration-300 font-sans pb-10">
      
      {/* ThemeToggle automatically rendered absolute fixed here */}
      <ThemeToggle />

      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-primary border-b border-primary px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-lg font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span>✨</span>
              <span>JordanLinks</span>
            </Link>
            <div className="hidden sm:flex items-center bg-secondary py-1.5 px-3.5 rounded-full border border-primary text-xs">
              <span className="text-secondary font-medium">Your page: </span>
              <a 
                href={`/links/${username}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-accent-indigo font-semibold ml-1 hover:underline flex items-center gap-1"
              >
                <span>jordanworld.co/links/{username}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-14">
            <button
              onClick={handleCopyLink}
              // iOS touch target guidelines (minimum 44px)
              className="flex items-center gap-1.5 px-4 py-2.5 border border-primary bg-primary rounded-xl hover:bg-secondary text-xs font-semibold cursor-pointer text-primary transition-colors h-11"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Page URL</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-11 h-11 border border-primary bg-primary rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 cursor-pointer transition-colors flex items-center justify-center"
              title="Log Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main dashboard space */}
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative">
        
        {/* Left Column: Form Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Action / Save Status */}
          <div className="flex justify-between items-center bg-primary p-4 border border-primary rounded-2xl shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-primary">Save your custom layout</h2>
              <p className="text-[11px] text-secondary">Make sure to save before exiting</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-primary border border-primary text-primary hover:bg-secondary text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 h-11"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : saveStatus === 'success' ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Save className="h-3.5 w-3.5 text-accent-indigo" />
              )}
              <span>
                {saving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
              </span>
            </button>
          </div>


          {/* Section 1: Profile Customization */}
          <section className="bg-primary p-6 border border-primary rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-primary pb-2">
              Profile Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={pfpUrl}
                  onChange={(e) => setPfpUrl(e.target.value)}
                  placeholder="e.g. https://images.com/myphoto.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                About Me / Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a short intro bio..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                Contact Email (Public)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="public-email@domain.com"
                className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
              />
            </div>
          </section>



          {/* Section 2: Social Handles */}
          <section className="bg-primary p-6 border border-primary rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-primary pb-2">
              Social Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                  <Instagram className="h-3.5 w-3.5 text-accent-indigo" />
                  <span>Instagram</span>
                </label>
                <input
                  type="text"
                  value={socials.instagram}
                  onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                  placeholder="Username only"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                  <Youtube className="h-3.5 w-3.5 text-accent-indigo" />
                  <span>YouTube</span>
                </label>
                <input
                  type="text"
                  value={socials.youtube}
                  onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                  placeholder="Channel ID or @handle"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                  <svg className="h-3.5 w-3.5 fill-current text-accent-indigo" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.39v7.91c.02 3.44-2.24 6.78-5.63 7.39-3.71.79-7.6-1.57-8.4-5.26-.88-3.78 1.34-7.9 5.16-8.79.99-.25 2.03-.23 3.03-.02v4.19c-.83-.24-1.74-.23-2.54.14-1.55.67-2.43 2.5-1.92 4.13.48 1.69 2.25 2.74 3.96 2.37 1.61-.31 2.72-1.84 2.66-3.48V0h.08z" />
                  </svg>
                  <span>TikTok</span>
                </label>
                <input
                  type="text"
                  value={socials.tiktok}
                  onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                  placeholder="Username only"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
                  <Twitter className="h-3.5 w-3.5 text-accent-indigo" />
                  <span>X (Twitter)</span>
                </label>
                <input
                  type="text"
                  value={socials.twitter}
                  onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                  placeholder="Username only"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Add Custom Link */}
          <section className="bg-primary p-6 border border-primary rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-primary pb-2">
              Add Custom Link
            </h3>

            <form onSubmit={handleAddLink} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">
                  Link Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My New Course"
                  className="w-full px-3 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g. website.com/link"
                  className="w-full px-3 py-2.5 rounded-xl border border-primary bg-transparent text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-indigo"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary border border-primary text-primary hover:bg-secondary font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors h-10"
                >
                  <Plus className="h-3.5 w-3.5 text-accent-indigo" />
                  <span>Add</span>
                </button>
              </div>
            </form>
          </section>

          {/* Section 4: Links List & Editing */}
          <section className="bg-primary p-6 border border-primary rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b border-primary pb-2">
              Manage Custom Links
            </h3>

            {links.length === 0 ? (
              <div className="py-8 text-center text-xs text-secondary border border-dashed border-primary rounded-2xl">
                No custom links added yet. Use the form above to add your first link.
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link, index) => (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-primary bg-secondary rounded-2xl flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between border-b border-primary pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary border border-primary text-primary">
                          #{index + 1}
                        </span>
                        {link.clicks !== undefined && (
                          <span className="text-[10px] font-medium text-secondary">
                            {link.clicks} clicks
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-500 hover:text-red-650 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer w-9 h-9 flex items-center justify-center"
                        title="Delete Link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-secondary uppercase mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-primary bg-transparent text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-indigo"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-secondary uppercase mb-1">
                          URL
                        </label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-primary bg-transparent text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-indigo"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Creator Analytics Dashboard Section */}
          <section className="bg-primary p-6 border border-primary rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-primary pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                PRIVATE CREATOR ANALYTICS
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Views Card */}
              <div className="bg-secondary p-5 border border-primary rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                  Total Page Views
                </span>
                <span className="text-2xl font-extrabold text-primary font-mono tracking-tight">
                  {views.toLocaleString()}
                </span>
              </div>
              
              {/* Clicks Card */}
              <div className="bg-secondary p-5 border border-primary rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                  Total Link Clicks
                </span>
                <span className="text-2xl font-extrabold text-primary font-mono tracking-tight">
                  {links.reduce((acc, l) => acc + (l.clicks || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Live Mobile Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 bg-transparent p-4 flex flex-col items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-primary text-secondary border border-primary shadow-xs">
              Live Preview
            </span>
            <PreviewMobile
              username={username}
              displayName={displayName}
              bio={bio}
              pfpUrl={pfpUrl}
              email={email}
              socials={socials}
              links={links}
            />
          </div>
        </div>

      </main>
    </div>
  );
};
export default Dashboard;
