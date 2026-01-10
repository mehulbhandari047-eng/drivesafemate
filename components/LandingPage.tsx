
import React from 'react';
import { PageView } from '../types';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate: (view: PageView) => void;
  currentView: PageView;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onNavigate, currentView, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation - Enhanced Transparency for Hero Integration */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-amber-400/95 dark:bg-amber-500/90 backdrop-blur-md border-b border-amber-500/20 px-6 py-4 flex justify-between items-center transition-colors shadow-lg shadow-amber-900/10"
      >
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(PageView.HOME)}>
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"
          >
            <i className="fas fa-steering-wheel text-amber-400"></i>
          </motion.div>
          <span className="text-xl font-black text-slate-900 tracking-tight">DriveSafeMate</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-800 uppercase tracking-widest">
          <button onClick={() => onNavigate(PageView.HOME)} className={`hover:text-slate-900 transition-colors relative pb-1 ${currentView === PageView.HOME ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-slate-900' : ''}`}>Home</button>
          <button onClick={() => onNavigate(PageView.ABOUT)} className={`hover:text-slate-900 transition-colors relative pb-1 ${currentView === PageView.ABOUT ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-slate-900' : ''}`}>About</button>
          <button onClick={() => onNavigate(PageView.SERVICES)} className={`hover:text-slate-900 transition-colors relative pb-1 ${currentView === PageView.SERVICES ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-slate-900' : ''}`}>Services</button>
          <button onClick={() => onNavigate(PageView.CONTACT)} className={`hover:text-slate-900 transition-colors relative pb-1 ${currentView === PageView.CONTACT ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-slate-900' : ''}`}>Contact</button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleDarkMode}
            className="text-slate-800 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-amber-300"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button onClick={onLogin} className="hidden sm:block text-sm font-bold text-slate-800 hover:text-slate-900 transition-colors">Sign In</button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted} 
            className="bg-slate-900 text-amber-400 px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:bg-slate-800 transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section with Custom Background */}
      {currentView === PageView.HOME && (
        <>
          <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-900">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <img 
                src="input_file_0.png" 
                alt="Australian Outback Sunset" 
                className="w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/40"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                    <i className="fas fa-certificate"></i>
                    <span>Australia's #1 Driving Academy</span>
                  </motion.div>
                  <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black text-white leading-[1.1] transition-colors drop-shadow-2xl">
                    Master the roads,<br />from the <span className="text-amber-400">Bush to the Beach.</span>
                  </motion.h1>
                  <motion.p variants={itemVariants} className="text-xl text-slate-200 leading-relaxed max-w-lg transition-colors drop-shadow-md font-medium">
                    DriveSafeMate Academy combines world-class instructors with smart Gemini-driven learning paths to get you on the road safely and confidently.
                  </motion.p>
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.05, shadow: "0 20px 25px -5px rgb(251 191 36 / 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onGetStarted} 
                      className="px-10 py-5 bg-amber-400 text-slate-900 rounded-2xl font-black text-xl shadow-2xl transition-all"
                    >
                      Start Learning Today
                    </motion.button>
                    <motion.button 
                      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                      className="px-8 py-5 bg-white/5 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-3"
                    >
                      <i className="fas fa-play-circle text-amber-400"></i>
                      <span>Watch how it works</span>
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Status Float Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="hidden lg:flex justify-end"
                >
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl space-y-6 max-w-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center text-2xl text-slate-900 shadow-inner">
                        <i className="fas fa-map-location-dot"></i>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">National Hubs</p>
                         <p className="text-xl font-black text-white">All States Active</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 2, delay: 1 }}
                          className="h-full bg-amber-400"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>LEARNING PROGRESS</span>
                        <span className="text-amber-400">85% PASS RATE</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed font-medium">"DriveSafeMate transformed my confidence. The outback routes were exactly what I needed." - Chloe, Darwin</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xl"
            >
              <i className="fas fa-chevron-down"></i>
            </motion.div>
          </section>

          {/* Key Advantages Section */}
          <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                <AdvantageCard 
                  icon="fa-shield-check" 
                  title="5-Star Vetted" 
                  desc="Every instructor is state-certified and background-checked for absolute safety."
                />
                <AdvantageCard 
                  icon="fa-robot" 
                  title="Gemini AI Path" 
                  desc="Personalized learning modules tailored to your skills and local road hazards."
                />
                <AdvantageCard 
                  icon="fa-calendar-day" 
                  title="Instant Booking" 
                  desc="Schedule or reschedule lessons in seconds through our seamless mobile portal."
                />
                <AdvantageCard 
                  icon="fa-map-location-dot" 
                  title="Local Experts" 
                  desc="Instructors who know every trick of your local test routes and typical hazards."
                />
              </motion.div>
            </div>
          </section>

          {/* AI Advantage Section */}
          <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-3xl mb-8">
                    <i className="fas fa-brain text-slate-900"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-6">AI-Powered Success</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">Our proprietary Gemini-driven learning system analyzes your driving style, identifies weak points, and curates a custom curriculum just for you.</p>
                  <ul className="space-y-4">
                    {['Personalized Practice Routes', 'Hazard Prediction Analytics', 'Real-time Logbook Sync'].map((text, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center space-x-3 text-amber-400 font-bold"
                      >
                         <i className="fas fa-check"></i>
                         <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <i className="fas fa-bolt absolute -bottom-20 -right-20 text-[20rem] opacity-5 -rotate-12 text-amber-400"></i>
              </motion.div>
              <div className="space-y-8">
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight transition-colors">Don't just drive. <br />Drive Smart.</h2>
                 <p className="text-xl text-slate-500 dark:text-slate-400 transition-colors">We believe technology can save lives. By pairing high-tech monitoring with high-touch instruction, we create the safest drivers in Australia.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div whileHover={{ y: -5 }} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors shadow-sm">
                       <p className="text-4xl font-black text-amber-500 mb-2">35%</p>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Faster Learning</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors shadow-sm">
                       <p className="text-4xl font-black text-amber-500 mb-2">1st</p>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Attempt Pass Rate</p>
                    </motion.div>
                 </div>
              </div>
            </div>
          </section>

          {/* 3 Steps Section */}
          <section className="py-32 px-6 bg-white dark:bg-slate-950 transition-colors">
             <div className="max-w-7xl mx-auto text-center mb-20">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">3 Steps to Independence</h2>
                <div className="h-1 w-20 bg-amber-400 mx-auto mt-4 rounded-full"></div>
             </div>
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="absolute top-1/4 left-0 w-full h-1 bg-slate-50 dark:bg-slate-900 hidden md:block -z-10"></div>
                <StepCard num="01" title="Get Matched" desc="Choose a verified instructor in your suburb based on rating, vehicle, and language." />
                <StepCard num="02" title="Personalize" desc="Let Gemini AI build your custom theory and practical learning roadmap." />
                <StepCard num="03" title="Pass the Test" desc="Complete mock tests and gain the confidence to ace your Practical Driving Test." />
             </div>
          </section>
        </>
      )}

      {/* Main Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <i className="fas fa-steering-wheel text-slate-900"></i>
              </div>
              <span className="text-xl font-black tracking-tight">DriveSafeMate</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering the next generation of Australian drivers with smart technology and compassionate training. Master the roads, from the Bush to the Beach.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><button onClick={() => onNavigate(PageView.HOME)} className="hover:text-amber-400 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate(PageView.ABOUT)} className="hover:text-amber-400 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate(PageView.SERVICES)} className="hover:text-amber-400 transition-colors">Services & Pricing</button></li>
              <li><button onClick={() => onNavigate(PageView.CONTACT)} className="hover:text-amber-400 transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-amber-400">Learning Portals</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Student Dashboard</button></li>
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Instructor Portal</button></li>
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Admin Hub</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Get safety tips and special offers.</p>
            <form className="relative">
              <input type="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
              <button className="absolute right-2 top-2 bg-amber-400 text-slate-900 p-1.5 rounded-lg text-xs">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} DriveSafeMate Academy. Australia Wide.</p>
        </div>
      </footer>
    </div>
  );
};

const AdvantageCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all flex flex-col items-center text-center group shadow-sm hover:shadow-xl"
  >
    <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{desc}</p>
  </motion.div>
);

const StepCard = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:shadow-xl transition-all"
  >
    <div className="text-5xl font-black text-slate-100 dark:text-slate-800 mb-6 group-hover:text-amber-500/10 transition-colors">{num}</div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 transition-colors">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{desc}</p>
  </motion.div>
);

export default LandingPage;
