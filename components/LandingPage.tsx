
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
      {/* Navigation */}
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

      {/* Hero Section */}
      {currentView === PageView.HOME && (
        <>
          <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
                alt="Australian Road Trip" 
                className="w-full h-full object-cover object-center opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/60"></div>
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
                    <span>Australia's #1 Multi-Vendor Driving Academy</span>
                  </motion.div>
                  <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black text-white leading-[1.1] transition-colors drop-shadow-2xl">
                    Real Instructors.<br />Real <span className="text-amber-400">Confidence.</span>
                  </motion.h1>
                  <motion.p variants={itemVariants} className="text-xl text-slate-200 leading-relaxed max-w-lg transition-colors drop-shadow-md font-medium">
                    Whether you're a student ready to log hours or an instructor ready to grow your fleet, DriveSafeMate is the community for you.
                  </motion.p>
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.05, shadow: "0 20px 25px -5px rgb(251 191 36 / 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onGetStarted} 
                      className="px-10 py-5 bg-amber-400 text-slate-900 rounded-2xl font-black text-xl shadow-2xl transition-all"
                    >
                      Find Your Instructor
                    </motion.button>
                    <motion.button 
                      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                      onClick={() => onNavigate(PageView.SERVICES)}
                      className="px-8 py-5 bg-white/5 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-3"
                    >
                      <i className="fas fa-handshake text-amber-400"></i>
                      <span>Partner With Us</span>
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
                        <i className="fas fa-users-gear"></i>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Community Pulse</p>
                         <p className="text-xl font-black text-white">450+ Active Vendors</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 2, delay: 1 }}
                          className="h-full bg-amber-400"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>STUDENT SATISFACTION</span>
                        <span className="text-amber-400">92% EXCELLENCE</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed font-medium">"Finally, a platform that feels human. My instructor Sarah was amazing, and the AI roadmap helped me ace my hazard test." - Ben, Melbourne</p>
                  </div>
                </motion.div>
              </div>
            </div>

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
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">Why Choose DriveSafeMate?</h2>
                <p className="text-slate-500 font-medium mt-2">The only platform built by Aussies, for Aussies.</p>
              </div>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                <AdvantageCard 
                  icon="fa-people-arrows" 
                  title="Multi-Vendor Choice" 
                  desc="Don't get stuck with one instructor. Choose from a diverse network of local driving experts."
                />
                <AdvantageCard 
                  icon="fa-robot" 
                  title="Safety AI Assistant" 
                  desc="Chat with 'Matey', our AI Safety assistant, for 24/7 road rule advice and platform help."
                />
                <AdvantageCard 
                  icon="fa-shield-halved" 
                  title="Vendor Vetting" 
                  desc="We verify every instructor's Working With Children Check and insurance for your peace of mind."
                />
                <AdvantageCard 
                  icon="fa-clock-rotate-left" 
                  title="Flexible Booking" 
                  desc="Manage your schedule on the go. Late bookings, trial sessions, and mock tests are just a tap away."
                />
              </motion.div>
            </div>
          </section>

          {/* AI Safety Section */}
          <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8 relative">
                 <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -z-10"></div>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight transition-colors">Your AI Safety <span className="text-amber-500">Co-Pilot.</span></h2>
                 <p className="text-xl text-slate-500 dark:text-slate-400 transition-colors leading-relaxed">We've integrated Google Gemini to provide a human-like learning experience. From real-time hazard advice to customized logbook goals, the tech works for you, not against you.</p>
                 
                 <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-6 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                       <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-magic"></i>
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 dark:text-white">Smart Path Generation</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Gemini analyzes your state's requirements to build the most efficient route to your P-plates.</p>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4 p-6 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                       <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-message-captions"></i>
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 dark:text-white">Matey AI Chat</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Got a tricky question about roundabouts or hook turns? Ask Matey anytime.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" className="rounded-[4rem] shadow-2xl grayscale-50 hover:grayscale-0 transition-all duration-700" alt="Student Driving" />
                <div className="absolute -bottom-10 -right-10 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 p-8 rounded-3xl shadow-2xl">
                   <p className="text-2xl font-black mb-1">Pass Faster.</p>
                   <p className="text-xs font-bold uppercase tracking-widest opacity-60">Avg. 15% fewer hours required</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Testimonial / Success Stories */}
          <section className="py-32 px-6 bg-white dark:bg-slate-950">
             <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                   <h2 className="text-4xl font-black text-slate-900 dark:text-white">Success Stories</h2>
                   <p className="text-slate-500 font-medium">Join thousands of happy Aussie drivers.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <TestimonialCard 
                     name="Jessica W." 
                     loc="Sydney, NSW" 
                     text="I was terrified of the M1. My instructor David was so patient, and the AI hazard simulator really helped me prepare for highway speeds."
                   />
                   <TestimonialCard 
                     name="Liam T." 
                     loc="Brisbane, QLD" 
                     text="As an instructor, the vendor portal changed my life. All my bookings, payments, and student progress are in one clean dashboard."
                   />
                   <TestimonialCard 
                     name="Arnav K." 
                     loc="Perth, WA" 
                     text="Converted my international license in just 3 weeks. The platform matched me with a manual specialist who knew exactly what the assessors look for."
                   />
                </div>
             </div>
          </section>

          {/* Final CTA */}
          <section className="py-24 px-6 bg-amber-400">
             <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Ready to find your independence?</h2>
                <p className="text-xl text-slate-900/70 font-bold">Start your journey today with Australia's most advanced driving academy.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <button onClick={onGetStarted} className="px-10 py-5 bg-slate-900 text-amber-400 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">Create Student Account</button>
                   <button onClick={() => onNavigate(PageView.SERVICES)} className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">Become a Partner</button>
                </div>
             </div>
          </section>
        </>
      )}

      {/* Footer */}
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
            <h4 className="font-bold text-lg mb-6 text-amber-400">Explore</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><button onClick={() => onNavigate(PageView.HOME)} className="hover:text-amber-400 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate(PageView.ABOUT)} className="hover:text-amber-400 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate(PageView.SERVICES)} className="hover:text-amber-400 transition-colors">Services & Pricing</button></li>
              <li><button onClick={() => onNavigate(PageView.CONTACT)} className="hover:text-amber-400 transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-amber-400">Partnerships</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Become an Instructor</button></li>
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Corporate Training</button></li>
              <li><button onClick={onLogin} className="hover:text-white transition-colors">NDIS Enquiries</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-amber-400">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Stay updated with road rule changes.</p>
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
          <div className="flex space-x-6">
             <button className="hover:text-white">Privacy</button>
             <button className="hover:text-white">Terms</button>
          </div>
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

const TestimonialCard = ({ name, loc, text }: { name: string, loc: string, text: string }) => (
  <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2">
     <div className="flex text-amber-400 text-xs mb-6">
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
        <i className="fas fa-star"></i>
     </div>
     <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed font-medium">"{text}"</p>
     <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center font-black text-slate-900">{name[0]}</div>
        <div>
           <p className="font-black text-slate-900 dark:text-white">{name}</p>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{loc}</p>
        </div>
     </div>
  </div>
);

export default LandingPage;
