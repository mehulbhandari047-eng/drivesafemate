
import React, { useState, useEffect } from 'react';
import { UserRole, PageView } from './types';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import NotificationToast from './components/NotificationToast';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import MetaSEO from './components/MetaSEO';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>(PageView.HOME);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setShowLogin(false);
    setCurrentView(PageView.HOME);
  };

  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    setCurrentView(PageView.DASHBOARD);
  };

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    if (view !== PageView.DASHBOARD) {
      setIsLoggedIn(false);
      setShowLogin(false);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="transition-colors duration-300">
      {/* Dynamic SEO Management */}
      <MetaSEO view={currentView} />
      
      {isLoggedIn ? (
        <Layout 
          userRole={userRole} 
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        >
          <NotificationToast />
          {userRole && <DashboardHome role={userRole} />}
        </Layout>
      ) : showLogin ? (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative transition-colors duration-300">
          <button 
            onClick={() => setShowLogin(false)}
            className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Home</span>
          </button>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-10 border border-slate-100 dark:border-slate-800 animate-scaleIn transition-colors duration-300">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl text-white text-4xl mb-6 shadow-2xl shadow-blue-200 dark:shadow-blue-900/20">
                <i className="fas fa-steering-wheel"></i>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Continue your journey with the Academy</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors">Email Address</label>
                <input type="email" defaultValue="john@example.com" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 transition-all outline-none font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors">Password</label>
                <input type="password" defaultValue="••••••••" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 transition-all outline-none font-medium" />
              </div>
              <button 
                onClick={() => { setIsLoggedIn(true); setUserRole(UserRole.STUDENT); setCurrentView(PageView.DASHBOARD); }}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all transform hover:-translate-y-1"
              >
                Sign In to Dashboard
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
                Don't have an account? <a href="#" className="text-blue-600 dark:text-blue-400 font-black hover:underline transition-colors">Join the Academy</a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
          <LandingPage 
            onGetStarted={() => setShowLogin(true)} 
            onLogin={() => setShowLogin(true)} 
            onNavigate={handleNavigate}
            currentView={currentView}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
          {currentView === PageView.ABOUT && <AboutPage />}
          {currentView === PageView.SERVICES && <ServicesPage />}
          {currentView === PageView.CONTACT && <ContactPage />}
        </div>
      )}
    </div>
  );
};

export default App;
