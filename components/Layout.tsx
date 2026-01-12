
import React, { useState, useEffect } from 'react';
import { UserRole, User, PageView } from '../types';
import { dbService } from '../services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate?: (view: PageView) => void;
  currentView?: PageView;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onSwitchRole, isDarkMode, onToggleDarkMode, onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dbStatus, setDbStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'DEGRADED'>('CONNECTED');
  const userRole = user?.role || null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    
    // Connectivity Monitor
    const interval = setInterval(async () => {
      const status = await dbService.checkConnectivity();
      setDbStatus(status);
    }, 15000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { label: 'Experiences', view: PageView.EXPLORE },
    { label: 'Pricing', view: PageView.SERVICES },
    { label: 'Academy', view: PageView.ABOUT },
    { label: 'Contact', view: PageView.CONTACT },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500 font-sans">
      {/* High-Fidelity Top Navigation */}
      <header className={`h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 md:px-20 sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'shadow-premium h-16' : ''}`}>
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate?.(PageView.HOME)}>
          <div className="w-9 h-9 bg-brand-400 rounded-lg flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-105 transition-transform">
            <i className="fas fa-steering-wheel text-lg"></i>
          </div>
          <span className="hidden md:block text-xl font-black tracking-tighter text-slate-900 dark:text-white">DeepDrive</span>
        </div>

        {/* Desktop Nav - Middle */}
        <div className={`hidden lg:flex items-center space-x-8 transition-opacity duration-300 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {navItems.map((item) => (
            <button 
              key={item.view}
              onClick={() => onNavigate?.(item.view)}
              className={`text-sm font-bold transition-all relative py-2 ${currentView === item.view ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {item.label}
              {currentView === item.view && <motion.div layoutId="navline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />}
            </button>
          ))}
          {user && (
            <button onClick={() => onNavigate?.(PageView.DASHBOARD)} className={`text-sm font-bold transition-all relative py-2 ${currentView === PageView.DASHBOARD ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              My Trips
              {currentView === PageView.DASHBOARD && <motion.div layoutId="navline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />}
            </button>
          )}
        </div>

        {/* Mini Search Pill (Appears on Scroll) */}
        <div className={`absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center airbnb-pill px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 cursor-pointer ${scrolled ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-[-20px] pointer-events-none'}`} onClick={() => onNavigate?.(PageView.EXPLORE)}>
           <span className="text-xs font-black px-4 border-r dark:border-slate-700">Anywhere</span>
           <span className="text-xs font-black px-4 border-r dark:border-slate-700">Any Time</span>
           <span className="text-xs font-medium px-4 text-slate-400">Add goals</span>
           <div className="w-7 h-7 bg-brand-400 rounded-full flex items-center justify-center text-slate-900 text-[10px] ml-1">
             <i className="fas fa-search"></i>
           </div>
        </div>

        {/* User Action Menu */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleDarkMode}
            className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-all"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center p-1.5 pl-4 space-x-3 border border-slate-200 dark:border-slate-700 rounded-full hover:shadow-md cursor-pointer transition-all bg-white dark:bg-slate-800 shadow-sm"
            >
              <i className="fas fa-bars text-slate-500 text-sm"></i>
              <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-8 h-8 rounded-full border border-slate-100 object-cover" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-floating py-4 overflow-hidden"
                >
                  {user ? (
                    <>
                      <div className="px-6 py-2 mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Profile</p>
                        <div className="flex gap-1 mt-2">
                          {[UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN].map(r => (
                            <button key={r} onClick={() => { onSwitchRole(r); setIsMenuOpen(false); }} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${userRole === r ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-200'}`}>{r[0]}</button>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                      <button className="w-full text-left px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Account</button>
                      <button className="w-full text-left px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Support Center</button>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                      <button onClick={onLogout} className="w-full text-left px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">Log out</button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left px-6 py-3 text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800">Sign Up</button>
                      <button className="w-full text-left px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Log In</button>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                      <button onClick={() => { onNavigate?.(PageView.SERVICES); setIsMenuOpen(false); }} className="w-full text-left px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Pricing</button>
                      <button className="w-full text-left px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Help Center</button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full">
          {children}
        </div>
      </div>
      
      {/* Footer (Airbnb style) */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-20 px-8 md:px-20 mt-auto">
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="space-y-4">
              <h5 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Resources</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li className="hover:underline cursor-pointer">NSW Licensing Hub</li>
                 <li className="hover:underline cursor-pointer">VIC Safety Rules</li>
                 <li className="hover:underline cursor-pointer">QLD Logbook App</li>
                 <li className="hover:underline cursor-pointer">NDIS Learning</li>
              </ul>
           </div>
           <div className="space-y-4">
              <h5 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Academy</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li className="hover:underline cursor-pointer">Our Mission</li>
                 <li className="hover:underline cursor-pointer">Instructor Standards</li>
                 <li className="hover:underline cursor-pointer">Safety Tech</li>
                 <li className="hover:underline cursor-pointer">Student Success</li>
              </ul>
           </div>
           <div className="space-y-4">
              <h5 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Support</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li className="hover:underline cursor-pointer">Help Center</li>
                 <li className="hover:underline cursor-pointer">Cancellation Policy</li>
                 <li className="hover:underline cursor-pointer">Contact Support</li>
                 <li className="hover:underline cursor-pointer">Community Forum</li>
              </ul>
           </div>
           <div className="space-y-4">
              <h5 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Database Status</h5>
              <div className="flex items-center space-x-3">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${dbStatus === 'CONNECTED' ? 'bg-emerald-500' : dbStatus === 'DEGRADED' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                 <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    {dbStatus === 'CONNECTED' ? 'Cloud Live' : dbStatus === 'DEGRADED' ? 'Cloud Degraded' : 'Cloud Offline'}
                 </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Verified connectivity to Supabase and Gemini endpoints.</p>
           </div>
        </div>
        <div className="max-w-8xl mx-auto border-t border-slate-200 dark:border-slate-800 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs text-slate-500 font-medium italic">© 2024 DriveSafeMate Academy • Built for Australian Roads • Privacy • Terms</p>
           <div className="flex space-x-8 text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
              <span className="flex items-center space-x-2 cursor-pointer hover:underline"><i className="fas fa-globe"></i><span>English (AU)</span></span>
              <span className="cursor-pointer hover:underline">AUD ($)</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
