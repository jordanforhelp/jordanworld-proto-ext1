import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Smartphone, BarChart3, Moon, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col justify-between p-6 bg-grid-pattern bg-primary transition-colors duration-300 relative safe-bottom-padding">
      
      {/* Absolute positioning ThemeToggle automatically overlays here */}
      <ThemeToggle />

      {/* Top Navigation */}
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="text-xl font-bold font-sans tracking-tight text-primary flex items-center gap-2">
          <span>✨</span>
          <span>JordanLinks</span>
        </div>
        <div className="flex items-center gap-12">
          <Link 
            to="/login" 
            className="text-sm font-semibold text-secondary hover:text-primary transition-colors pr-10"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 py-12">
        
        {/* Decorative Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-[10px] font-bold tracking-widest text-secondary uppercase mb-6 border border-primary"
        >
          <Sparkles className="h-3 w-3 text-accent-indigo" />
          <span>Premium Curated Creator Space</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-primary mb-6 leading-[1.1] font-sans"
        >
          The elegant case study <br className="hidden sm:inline" />
          for digital first creators
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-secondary max-w-xl mb-10 leading-relaxed"
        >
          Consolidate your social handles, custom links, and contact info into a sleek lightning fast landing page. Built for performance and premium aesthetics.
        </motion.p>

        {/* CTA Buttons - min-h-[44px] touch target area */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-primary border border-primary text-primary hover:bg-secondary font-bold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
          >
            <span>Claim Your Space</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-secondary border border-primary text-primary font-bold rounded-full hover:bg-primary transition-colors text-sm cursor-pointer"
          >
            Manage Dashboard
          </Link>
        </motion.div>

        {/* Features Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mt-20 border-t border-primary pt-10"
        >
          <div className="flex flex-col items-center p-2">
            <div className="p-3 bg-secondary border border-primary rounded-2xl mb-3 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-primary mb-1">Mobile First</h3>
            <p className="text-[10px] text-secondary">Perfect iOS-native layout scaling</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="p-3 bg-secondary border border-primary rounded-2xl mb-3 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-primary mb-1">GPU Accelerated</h3>
            <p className="text-[10px] text-secondary">Buttery-smooth Framer scroll reveals</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="p-3 bg-secondary border border-primary rounded-2xl mb-3 text-primary">
              <Moon className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-primary mb-1">Semantic Themes</h3>
            <p className="text-[10px] text-secondary">High-contrast light/dark mode</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="p-3 bg-secondary border border-primary rounded-2xl mb-3 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-primary mb-1">Link Analytics</h3>
            <p className="text-[10px] text-secondary">Integrated real-time click tracking</p>
          </div>
        </motion.div>

      </main>

      {/* Bottom Footer */}
      <footer className="text-center py-6 text-xs text-secondary border-t border-primary max-w-5xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>&copy; {new Date().getFullYear()} JordanLinks. All rights reserved.</span>
      </footer>
    </div>
  );
};
export default Home;
