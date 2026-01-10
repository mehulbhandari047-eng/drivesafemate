
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onSwitchRole, isDarkMode, onToggleDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = user?.role || null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <AnimatePresence>
        {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.nav 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 md:relative md:flex md:w-72 flex-col bg-slate-900 border-r border-slate-800 text-white shadow-2xl"
          >
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div 
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20"
                >
                  <i className="fas fa-steering-wheel text-slate-900 text-lg"></i>
                </motion.div>
                <span className="text-xl font-black tracking-tight uppercase">DeepDrive</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Navigation</p>
              
              <NavItem icon="fa-grid-2" label="Overview" active />
              
              {userRole === UserRole.STUDENT && (
                <>
                  <NavItem icon="fa-magnifying-glass" label="Find Coaches" />
                  <NavItem icon="fa-calendar-days" label="Bookings" />
                  <NavItem icon="fa-route" label="AI roadmap" />
                </>
              )}
              
              {userRole === UserRole.INSTRUCTOR && (
                <>
                  <NavItem icon="fa-users" label="Student List" />
                  <NavItem icon="fa-clock-rotate-left" label="Manage Time" />
                  <NavItem icon="fa-wallet" label="Earnings" />
                </>
              )}
              
              {userRole === UserRole.ADMIN && (
                <>
                  <NavItem icon="fa-shield-halved" label="Governance" />
                  <NavItem icon="fa-chart-mixed" label="Analytics" />
                </>
              )}
              
              <div className="mt-8 pt-8 border-t border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Account</p>
                <NavItem icon="fa-gear" label="Settings" />
                <button 
                  onClick={onLogout} 
                  className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                >
                  <i className="fas fa-arrow-right-from-bracket w-6 group-hover:translate-x-1 transition-transform"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-950/40 m-4 rounded-3xl border border-slate-800">
              <p className="text-[9px] font-black uppercase text-slate-600 mb-3 tracking-tighter">Quick Role Swap</p>
              <div className="flex gap-2">
                {[UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN].map((role) => (
                  <button 
                    key={role}
                    onClick={() => onSwitchRole(role)} 
                    title={role}
                    className={`flex-1 h-8 text-[10px] font-black rounded-lg transition-all ${userRole === role ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                  >
                    {role[0]}
                  </button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-all shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-900 dark:text-white p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <i className="fas fa-bars-staggered text-xl"></i>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {userRole === UserRole.ADMIN ? 'System Control' : userRole === UserRole.INSTRUCTOR ? 'Coach Portal' : 'Academy Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ rotate: 180 }}
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </motion.button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{user?.name || 'User'}</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{userRole}</p>
              </div>
              <div className="relative">
                <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-md object-cover" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
  <motion.button 
    whileHover={{ x: 6 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-2xl transition-all ${
      active 
      ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/10' 
      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    <i className={`fas ${icon} w-8 text-lg`}></i>
    <span>{label}</span>
  </motion.button>
);

export default Layout;
