
import React, { useState, useEffect } from 'react';
import { UserRole, PageView, User, Instructor } from './types';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import ExplorePage from './components/ExplorePage';
import NotificationToast from './components/NotificationToast';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import MetaSEO from './components/MetaSEO';
import Auth from './components/Auth';
import SafetyAssistant from './components/SafetyAssistant';
import InstructorOnboarding from './components/InstructorOnboarding';
import BookingSystem from './components/BookingSystem';
import { dbService } from './services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [currentView, setCurrentView] = useState<PageView>(PageView.HOME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  // Specific state for the booking journey
  const [selectedInstructorForBooking, setSelectedInstructorForBooking] = useState<Instructor | null>(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    dbService.seedData();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView(PageView.HOME);
    setSelectedInstructorForBooking(null);
    setIsOnboarding(false);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowAuth(false);
    if (user.role === UserRole.INSTRUCTOR && !user.isVerified) {
       setIsOnboarding(true);
    } else {
       setCurrentView(PageView.DASHBOARD);
    }
  };

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    setSelectedInstructorForBooking(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBookingFlow = (instructor: Instructor) => {
    if (!isLoggedIn) {
      setAuthMode('LOGIN');
      setShowAuth(true);
      return;
    }
    setSelectedInstructorForBooking(instructor);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MetaSEO view={currentView} />
      <SafetyAssistant />
      <NotificationToast />

      {showAuth && (
        <Auth 
          mode={authMode} 
          onAuthSuccess={handleAuthSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}

      <Layout 
        user={currentUser} 
        onLogout={handleLogout}
        onSwitchRole={(role) => setCurrentUser(dbService.getMockUserByRole(role))}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onNavigate={handleNavigate}
        currentView={currentView}
      >
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {/* Logged in views */}
            {isLoggedIn && currentView === PageView.DASHBOARD && !isOnboarding && (
               <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <DashboardHome role={currentUser!.role} user={currentUser!} />
               </motion.div>
            )}
            
            {isLoggedIn && isOnboarding && (
              <InstructorOnboarding 
                key="onboarding" 
                user={currentUser!} 
                onComplete={() => {
                  setIsOnboarding(false);
                  setCurrentUser({ ...currentUser!, isVerified: true });
                  setCurrentView(PageView.DASHBOARD);
                }} 
              />
            )}

            {/* If a booking is in progress, override the current view with the checkout flow */}
            {selectedInstructorForBooking && (
              <motion.div key="booking-checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <BookingSystem 
                   student={currentUser!} 
                   preSelectedInstructor={selectedInstructorForBooking}
                   onBack={() => setSelectedInstructorForBooking(null)} 
                   onBookingComplete={() => {
                     setSelectedInstructorForBooking(null);
                     handleNavigate(PageView.DASHBOARD);
                   }} 
                 />
              </motion.div>
            )}

            {/* Public and Common Views */}
            {!selectedInstructorForBooking && (
              <>
                {currentView === PageView.HOME && (
                  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LandingPage 
                      onGetStarted={() => { setAuthMode('SIGNUP'); setShowAuth(true); }} 
                      onLogin={() => { setAuthMode('LOGIN'); setShowAuth(true); }} 
                      onNavigate={handleNavigate}
                      currentView={currentView}
                      isDarkMode={isDarkMode}
                      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                    />
                  </motion.div>
                )}
                {currentView === PageView.EXPLORE && (
                  <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ExplorePage 
                      student={currentUser} 
                      onBack={() => handleNavigate(PageView.HOME)} 
                      onBookInstructor={startBookingFlow}
                    />
                  </motion.div>
                )}
                {currentView === PageView.ABOUT && (
                  <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AboutPage />
                  </motion.div>
                )}
                {currentView === PageView.SERVICES && (
                  <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ServicesPage />
                  </motion.div>
                )}
                {currentView === PageView.CONTACT && (
                  <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ContactPage />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </main>
      </Layout>
    </div>
  );
};

export default App;
