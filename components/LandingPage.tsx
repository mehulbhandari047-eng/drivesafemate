
import React from 'react';
import { PageView } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate: (view: PageView) => void;
  currentView: PageView;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onNavigate, currentView, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-6 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(PageView.HOME)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-steering-wheel text-white"></i>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">DriveSafeMate</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <button onClick={() => onNavigate(PageView.HOME)} className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === PageView.HOME ? 'text-blue-600 dark:text-blue-400' : ''}`}>Home</button>
          <button onClick={() => onNavigate(PageView.ABOUT)} className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === PageView.ABOUT ? 'text-blue-600 dark:text-blue-400' : ''}`}>About</button>
          <button onClick={() => onNavigate(PageView.SERVICES)} className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === PageView.SERVICES ? 'text-blue-600 dark:text-blue-400' : ''}`}>Services</button>
          <button onClick={() => onNavigate(PageView.CONTACT)} className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === PageView.CONTACT ? 'text-blue-600 dark:text-blue-400' : ''}`}>Contact</button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleDarkMode}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button onClick={onLogin} className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</button>
          <button onClick={onGetStarted} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero Section (only on HOME) */}
      {currentView === PageView.HOME && (
        <>
          <section className="relative pt-40 pb-20 px-6 overflow-hidden bg-white dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10 space-y-8 animate-fadeIn">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                  <i className="fas fa-certificate"></i>
                  <span>Australia's #1 Driving Academy</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
                  Master the roads, from the <span className="text-blue-600 dark:text-blue-400">Bush to the Beach.</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg transition-colors">
                  DriveSafeMate Academy combines world-class instructors with smart AI-driven learning paths to get you on the road safely and confidently.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={onGetStarted} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                    Start Learning Today
                  </button>
                  <button className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2">
                    <i className="fas fa-play-circle"></i>
                    <span>How it Works</span>
                  </button>
                </div>
              </div>
              <div className="relative animate-fadeInRight">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 transition-colors">
                  <img src="input_file_0.png" alt="Drive Safe Mate Academy" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 hidden md:block animate-bounce-slow transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl transition-colors">
                      <i className="fas fa-id-card"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">License Status</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">P-Plate Ready! ✨</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Advantage Section */}
          <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-8">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-6">AI-Powered Success</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">Our proprietary Gemini-driven learning system analyzes your driving style, identifies weak points, and curates a custom curriculum just for you.</p>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3 text-blue-400 font-bold">
                       <i className="fas fa-check"></i>
                       <span>Personalized Practice Routes</span>
                    </li>
                    <li className="flex items-center space-x-3 text-blue-400 font-bold">
                       <i className="fas fa-check"></i>
                       <span>Hazard Prediction Analytics</span>
                    </li>
                    <li className="flex items-center space-x-3 text-blue-400 font-bold">
                       <i className="fas fa-check"></i>
                       <span>Real-time Logbook Sync</span>
                    </li>
                  </ul>
                </div>
                <i className="fas fa-bolt absolute -bottom-20 -right-20 text-[20rem] opacity-5 -rotate-12"></i>
              </div>
              <div className="space-y-8">
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight transition-colors">Don't just drive. <br />Drive Smart.</h2>
                 <p className="text-xl text-slate-500 dark:text-slate-400 transition-colors">We believe technology can save lives. By pairing high-tech monitoring with high-touch instruction, we create the safest drivers in Australia.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors shadow-sm">
                       <p className="text-4xl font-black text-blue-600 mb-2">35%</p>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Faster Learning</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors shadow-sm">
                       <p className="text-4xl font-black text-blue-600 mb-2">1st</p>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Attempt Pass Rate</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* 3 Steps Section */}
          <section className="py-32 px-6 bg-white dark:bg-slate-950 transition-colors">
             <div className="max-w-7xl mx-auto text-center mb-20">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">3 Steps to Independence</h2>
                <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
             </div>
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="absolute top-1/4 left-0 w-full h-1 bg-slate-50 dark:bg-slate-900 hidden md:block -z-10"></div>
                <StepCard num="01" title="Get Matched" desc="Choose a verified instructor in your suburb based on rating, vehicle, and language." />
                <StepCard num="02" title="Personalize" desc="Let Gemini AI build your custom theory and practical learning roadmap." />
                <StepCard num="03" title="Pass the Test" desc="Complete mock tests and gain the confidence to ace your Practical Driving Test." />
             </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-24 px-6 bg-slate-900 dark:bg-slate-900 text-white transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <Stat icon="fa-user-check" value="500+" label="Certified Instructors" />
              <Stat icon="fa-smile" value="98%" label="Success Rate" />
              <Stat icon="fa-map-pin" value="250+" label="Suburbs Covered" />
              <Stat icon="fa-shield-alt" value="100%" label="Safe Driving Guarantee" />
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="py-32 px-6 bg-white dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">Real Stories from Real Drivers</h2>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <Testimonial text="The AI learning path helped me focus on my weaknesses. Passed my NSW P-test on the first try!" author="Liam O." location="Bondi, NSW" />
              <Testimonial text="Instructors are incredibly patient. I was a nervous driver, but now I love being on the road." author="Emma S." location="Melbourne, VIC" />
              <Testimonial text="Great booking experience. Highly recommend the 10-hour package for the best savings." author="David K." location="Brisbane, QLD" />
            </div>
          </section>
        </>
      )}

      {/* Main Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-steering-wheel text-white"></i>
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
              <li><button onClick={() => onNavigate(PageView.HOME)} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate(PageView.ABOUT)} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate(PageView.SERVICES)} className="hover:text-white transition-colors">Services & Pricing</button></li>
              <li><button onClick={() => onNavigate(PageView.CONTACT)} className="hover:text-white transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Learning Portals</h4>
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
              <input type="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              <button className="absolute right-2 top-2 bg-blue-600 p-1.5 rounded-lg text-xs">
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

const StepCard = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:shadow-xl transition-all">
    <div className="text-5xl font-black text-slate-100 dark:text-slate-800 mb-6 group-hover:text-blue-600/10 transition-colors">{num}</div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 transition-colors">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{desc}</p>
  </div>
);

const Stat = ({ icon, value, label }: { icon: string; value: string; label: string }) => (
  <div className="space-y-2">
    <div className="text-blue-500 dark:text-blue-400 text-3xl mb-2 transition-colors">
      <i className={`fas ${icon}`}></i>
    </div>
    <p className="text-4xl font-black">{value}</p>
    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{label}</p>
  </div>
);

const Testimonial = ({ text, author, location }: { text: string; author: string; location: string }) => (
  <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all">
    <div className="text-yellow-400 mb-6 flex space-x-1">
      {[1, 2, 3, 4, 5].map(i => <i key={i} className="fas fa-star text-xs"></i>)}
    </div>
    <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed transition-colors">"{text}"</p>
    <div>
      <p className="font-bold text-slate-900 dark:text-white transition-colors">{author}</p>
      <p className="text-xs text-slate-500 dark:text-slate-500 font-medium transition-colors">{location}</p>
    </div>
  </div>
);

export default LandingPage;
