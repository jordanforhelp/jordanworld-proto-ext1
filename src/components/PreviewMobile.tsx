import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface Socials {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
}

interface PreviewMobileProps {
  displayName: string;
  username: string;
  bio: string;
  pfpUrl: string;
  email: string;
  socials: Socials;
  links: LinkItem[];
}

export const PreviewMobile: React.FC<PreviewMobileProps> = ({
  displayName,
  username,
  bio,
  pfpUrl,
  email,
  socials,
  links
}) => {
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

  return (
    <div className="w-[320px] h-[640px] border-[8px] border-primary rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col font-sans select-none transition-colors duration-300">
      
      {/* Premium High-Contrast Monochromatic Background */}
      <div className="absolute inset-0 bg-primary bg-grid-pattern -z-10" />

      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-primary border-b border-x border-primary rounded-b-2xl z-20 flex justify-center items-center">
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mb-1"></div>
      </div>

      {/* Screen area */}
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-6 flex flex-col items-center safe-bottom-padding">
        
        {/* Profile Avatar */}
        <div className="mt-4 mb-3 relative">
          {pfpUrl ? (
            <img 
              src={pfpUrl} 
              alt="Avatar" 
              className="w-20 h-20 rounded-full object-cover border border-primary shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${username || 'JL'}`;
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border border-primary text-secondary font-bold text-xl uppercase">
              {username ? username.substring(0, 2) : 'JL'}
            </div>
          )}
        </div>

        {/* Display Name & Username */}
        <h2 className="text-base font-bold text-primary tracking-tight mb-0.5 text-center px-2">
          {displayName || `@${username || 'username'}`}
        </h2>
        {displayName && (
          <p className="text-[11px] font-semibold text-secondary mb-2">
            @{username || 'username'}
          </p>
        )}

        {/* Dynamic Bio */}
        {bio && (
          <p className="text-xs text-secondary text-center max-w-[240px] leading-relaxed mb-4">
            {bio}
          </p>
        )}

        {/* Borderless Floating Oversized w-12 h-12 Social Icons Grid */}
        <div className="flex items-center justify-center gap-3.5 mb-5 flex-wrap px-2">
          {socials.instagram && (
            <a 
              href="#" 
              className="w-12 h-12 flex items-center justify-center text-primary hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <InstagramIcon />
            </a>
          )}
          {socials.youtube && (
            <a 
              href="#" 
              className="w-12 h-12 flex items-center justify-center text-primary hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <YoutubeIcon />
            </a>
          )}
          {socials.tiktok && (
            <a 
              href="#" 
              className="w-12 h-12 flex items-center justify-center text-primary hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <TiktokIcon />
            </a>
          )}
          {socials.twitter && (
            <a 
              href="#" 
              className="w-12 h-12 flex items-center justify-center text-primary hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <XIcon />
            </a>
          )}
          {email && (
            <a 
              href="#" 
              className="w-12 h-12 flex items-center justify-center text-primary hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <MailIcon />
            </a>
          )}
        </div>

        {/* Divider */}
        {links.length > 0 && (
          <hr className="w-full border-primary mb-5" />
        )}

        {/* Links List - Adaptive Monochromatic Cards with w-6 h-6 action icons */}
        <div className="w-full space-y-3 px-2 flex-1">
          {links.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-primary rounded-2xl p-6 text-center text-secondary text-xs">
              <span>Custom links will appear here</span>
            </div>
          ) : (
            links.map((link) => (
              <motion.div
                key={link.id}
                whileHover={{ scale: 1.03 }}
                className="w-full rounded-2xl border border-primary dark:border-white/[0.05] bg-white dark:bg-white/[0.03] dark:backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-250 cursor-pointer"
              >
                <a
                  href="#"
                  className="w-full py-3.5 px-4 flex items-center justify-between text-primary group"
                >
                  <span className="text-xs font-semibold truncate pr-4 text-left">
                    {link.title || 'Untitled Link'}
                  </span>
                  <div className="w-6 h-6 flex items-center justify-center text-secondary group-hover:text-primary transition-colors flex-shrink-0">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                </a>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-[9px] font-bold tracking-widest text-secondary uppercase">
          ⚡ jordanlinks
        </div>
      </div>
    </div>
  );
};
export default PreviewMobile;
