
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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <AnimatePresence>
        {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.nav 
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 md:relative md:flex md:w-64 flex-col bg-slate-900 dark:bg-slate-900 text-white shadow-2xl md:shadow-none"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center"
                >
                  <i className="fas fa-steering-wheel text-slate-900"></i>
                </motion.div>
                <span className="text-xl font-bold tracking-tight">DriveSafeMate</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu</p>
              <NavItem icon="fa-chart-pie" label="Dashboard" active />
              {userRole === UserRole.STUDENT && (
                <>
                  <NavItem icon="fa-search" label="Find Instructors" />
                  <NavItem icon="fa-calendar-check" label="My Bookings" />
                  <NavItem icon="fa-book-open" label="Learning Path" />
                </>
              )}
              {userRole === UserRole.INSTRUCTOR && (
                <>
                  <NavItem icon="fa-users" label="Students" />
                  <NavItem icon="fa-clock" label="Availability" />
                  <NavItem icon="fa-wallet" label="Earnings" />
                </>
              )}
              {userRole === UserRole.ADMIN && (
                <>
                  <NavItem icon="fa-user-shield" label="User Mgmt" />
                  <NavItem icon="fa-file-invoice-dollar" label="Revenue" />
                </>
              )}
              <hr className="border-slate-800 my-4" />
              <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors group">
                <i className="fas fa-sign-out-alt w-5 group-hover:-translate-x-1 transition-transform"></i>
                <span>Logout</span>
              </button>
            </div>

            <div className="p-4 bg-slate-800/50 mt-auto">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-2 text-center">Persona Switcher</p>
              <div className="grid grid-cols-3 gap-1">
                {[UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN].map((role) => (
                  <button 
                    key={role}
                    onClick={() => onSwitchRole(role)} 
                    className={`px-1 py-1 text-[8px] font-bold rounded transition-colors ${userRole === role ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {role.slice(0, 5)}
                  </button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-amber-400 dark:bg-amber-500 border-b border-amber-500/20 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-900 p-2">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h2 className="text-lg font-black text-slate-900">
            {userRole === UserRole.ADMIN ? 'Admin Hub' : userRole === UserRole.INSTRUCTOR ? 'Instructor Portal' : 'Student Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileTap={{ rotate: 180 }}
              onClick={onToggleDarkMode}
              className="text-slate-800 p-2 rounded-full hover:bg-amber-300"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </motion.button>
            <div className="flex items-center space-x-3 border-l border-amber-500/40 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none text-slate-900">{user?.name || 'User'}</p>
                <p className="text-[10px] font-black uppercase text-slate-800 opacity-70">{userRole}</p>
              </div>
              <img src={user?.avatar || "https://picsum.photos/100"} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white/50 shadow-sm object-cover" />
            </div>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-y-auto p-6 scrollbar-hide"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
  <motion.button 
    whileHover={{ x: 5 }}
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${active ? 'bg-amber-400 text-slate-900 font-bold shadow-lg shadow-amber-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <i className={`fas ${icon} w-5`}></i>
    <span>{label}</span>
  </motion.button>
);

export default Layout;
