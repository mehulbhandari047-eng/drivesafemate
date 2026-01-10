
import React, { useState, useEffect } from 'react';
import { UserRole, PageView, User, Instructor } from './types';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import NotificationToast from './components/NotificationToast';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import MetaSEO from './components/MetaSEO';
import Auth from './components/Auth';
import InstructorOnboarding from './components/InstructorOnboarding';
import { dbService } from './services/databaseService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [currentView, setCurrentView] = useState<PageView>(PageView.HOME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Seed Database on Mount
  useEffect(() => {
    dbService.seedData();
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowAuth(false);
    setCurrentView(PageView.HOME);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowAuth(false);
    
    // If it's a new instructor, send them to onboarding
    if (user.role === UserRole.INSTRUCTOR) {
      setIsOnboarding(true);
      setCurrentView(PageView.DASHBOARD);
    } else {
      setCurrentView(PageView.DASHBOARD);
    }
  };

  const handleOnboardingComplete = (instructor: Instructor) => {
    setIsOnboarding(false);
    // Refresh user or state if needed
  };

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    if (view !== PageView.DASHBOARD) {
      setIsLoggedIn(false);
      setShowAuth(false);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="transition-colors duration-300">
      <MetaSEO view={currentView} />
      
      {showAuth && (
        <Auth 
          mode={authMode} 
          onAuthSuccess={handleAuthSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}

      {isLoggedIn ? (
        <Layout 
          user={currentUser} 
          onLogout={handleLogout}
          onSwitchRole={(role) => setCurrentUser(dbService.getMockUserByRole(role))}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        >
          <NotificationToast />
          {isOnboarding ? (
            <InstructorOnboarding user={currentUser!} onComplete={handleOnboardingComplete} />
          ) : (
            <DashboardHome role={currentUser!.role} user={currentUser!} />
          )}
        </Layout>
      ) : (
        <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
          <LandingPage 
            onGetStarted={() => { setAuthMode('SIGNUP'); setShowAuth(true); }} 
            onLogin={() => { setAuthMode('LOGIN'); setShowAuth(true); }} 
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
