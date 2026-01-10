
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole | null;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, onSwitchRole, isDarkMode, onToggleDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar / Nav */}
      <nav className={`fixed inset-0 z-50 md:relative md:flex md:w-64 flex-col bg-slate-900 dark:bg-slate-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-steering-wheel text-white"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">DriveSafeMate</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {userRole ? (
            <>
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
                  <NavItem icon="fa-file-invoice-dollar" label="System Revenue" />
                  <NavItem icon="fa-cogs" label="Settings" />
                </>
              )}
              <hr className="border-slate-800 my-4" />
              <div className="mt-auto space-y-1">
                <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                  <i className="fas fa-sign-out-alt w-5"></i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
             <div className="px-4 text-slate-400 italic">Select a role to start</div>
          )}
        </div>

        <div className="p-4 bg-slate-800/50 mt-auto">
          <p className="text-xs text-slate-500 mb-2">Switch View (Dev Only)</p>
          <div className="grid grid-cols-3 gap-1">
            <button onClick={() => onSwitchRole(UserRole.STUDENT)} className="px-2 py-1 text-[10px] bg-blue-600 rounded">Student</button>
            <button onClick={() => onSwitchRole(UserRole.INSTRUCTOR)} className="px-2 py-1 text-[10px] bg-emerald-600 rounded">Inst.</button>
            <button onClick={() => onSwitchRole(UserRole.ADMIN)} className="px-2 py-1 text-[10px] bg-purple-600 rounded">Admin</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-600 dark:text-slate-400 p-2">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors">
              {userRole === UserRole.ADMIN ? 'Admin Hub' : userRole === UserRole.INSTRUCTOR ? 'Instructor Portal' : 'Student Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleDarkMode}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white relative">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l dark:border-slate-800 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none dark:text-white">John Doe</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userRole}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 overflow-hidden">
                <img src="https://picsum.photos/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
  <button className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <i className={`fas ${icon} w-5`}></i>
    <span>{label}</span>
  </button>
);

export default Layout;
