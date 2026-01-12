
import React, { useState } from 'react';
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

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onNavigate, currentView }) => {
  const [searchLocation, setSearchLocation] = useState('');
  
  if (currentView !== PageView.HOME) return null;

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Cinematic Hero */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1469033019974-296ff4da9204?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover brightness-75"
             alt="Open Road Australia"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-slate-950"></div>
        </div>

        <div className="relative z-10 max-w-4xl space-y-10 animate-slideUp">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
            Drive <span className="text-brand-400">Independent.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow-lg max-w-2xl mx-auto">
            Book top-rated Australian instructors for manual and automatic training.
          </p>

          {/* Airbnb Floating Search Pill */}
          <div className="airbnb-pill p-2 pl-8 pr-2 bg-white dark:bg-slate-900 flex items-center justify-between w-full max-w-3xl mx-auto cursor-pointer group shadow-floating border-none mt-12">
            <div className="flex-1 text-left border-r border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-0.5">Location</p>
              <input 
                type="text" 
                placeholder="Where are you learning?" 
                className="bg-transparent border-none outline-none w-full text-sm text-slate-500 placeholder:text-slate-400 font-medium"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="flex-1 text-left px-8 border-r border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-0.5">Transmission</p>
              <p className="text-sm text-slate-400 font-medium">Auto or Manual</p>
            </div>
            <div className="flex-1 text-left px-8">
              <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-0.5">Schedule</p>
              <p className="text-sm text-slate-400 font-medium">Add dates</p>
            </div>
            <button 
              onClick={() => onNavigate(PageView.EXPLORE)}
              className="bg-brand-500 hover:bg-brand-600 w-14 h-14 rounded-full flex items-center justify-center text-slate-900 group-hover:scale-105 transition-all shadow-lg"
            >
              <i className="fas fa-search text-lg"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Discovery Collections */}
      <section className="py-24 px-8 md:px-20 max-w-8xl mx-auto space-y-16">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h2 className="text-4xl font-black tracking-tight dark:text-white">Curated by Road Experts</h2>
              <p className="text-slate-500 text-lg mt-2">Unique training experiences for every stage of your journey.</p>
           </div>
           <button onClick={() => onNavigate(PageView.EXPLORE)} className="text-sm font-bold underline decoration-2 underline-offset-4">Explore all 450+ Coaches</button>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <ExperienceCard 
              img="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
              title="City Navigation" 
              subtitle="Master CBD driving in Sydney & Melbourne" 
              price="$75"
            />
            <ExperienceCard 
              img="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop" 
              title="Test Ready Sessions" 
              subtitle="Intensive prep for your P-Plate test" 
              price="$120"
            />
            <ExperienceCard 
              img="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop" 
              title="Rural Highway" 
              subtitle="Long distance high-speed proficiency" 
              price="$85"
            />
            <ExperienceCard 
              img="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2012&auto=format&fit=crop" 
              title="Evening Safety" 
              subtitle="Night logging with certified pros" 
              price="$90"
            />
         </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-5xl font-black dark:text-white leading-tight">Your safety is our <span className="text-brand-500">priority.</span></h2>
              <p className="text-xl text-slate-500 font-medium">We verify every instructor and vehicle to ensure you learn in the safest environment possible.</p>
              
              <div className="space-y-6">
                <TrustItem icon="fa-shield-heart" title="Verified Background Checks" desc="All instructors hold valid Working with Children Checks and state driving authorities." />
                <TrustItem icon="fa-car-burst" title="Full Insurance Coverage" desc="Comprehensive insurance on every vehicle, including dual-control systems." />
                <TrustItem icon="fa-headset" title="24/7 Safety Support" desc="Our team is available round the clock for students and instructors." />
              </div>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop" className="rounded-[4rem] shadow-2xl" alt="Safety" />
               <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border dark:border-slate-700">
                  <div className="flex items-center space-x-3 text-emerald-500 font-black">
                    <i className="fas fa-certificate text-2xl"></i>
                    <span>TfNSW Approved</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Academy Stats */}
      <section className="py-24 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
           <div><p className="text-5xl font-black mb-2 dark:text-white">450+</p><p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Coaches</p></div>
           <div><p className="text-5xl font-black mb-2 dark:text-white">85k</p><p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Students</p></div>
           <div><p className="text-5xl font-black mb-2 dark:text-white">99%</p><p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Pass Rate</p></div>
           <div><p className="text-5xl font-black mb-2 dark:text-white">24/7</p><p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Support</p></div>
        </div>
      </section>
    </div>
  );
};

const ExperienceCard = ({ img, title, subtitle, price }: any) => (
  <div className="group cursor-pointer">
    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-5 shadow-sm">
      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
    </div>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-black text-xl text-slate-900 dark:text-white">{title}</h4>
        <p className="text-slate-500 font-medium">{subtitle}</p>
        <p className="text-slate-900 dark:text-white font-black mt-2">{price} <span className="font-medium text-slate-400">/ experience</span></p>
      </div>
      <div className="flex items-center space-x-1 font-bold text-sm">
        <i className="fas fa-star text-[10px]"></i>
        <span>5.0</span>
      </div>
    </div>
  </div>
);

const TrustItem = ({ icon, title, desc }: any) => (
  <div className="flex items-start space-x-5 group">
    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl text-slate-900 dark:text-white flex-shrink-0 group-hover:bg-brand-400 group-hover:text-slate-900 transition-colors">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <h4 className="font-black text-lg dark:text-white">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
