
import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fadeIn bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
              <i className="fas fa-flag-checkered"></i>
              <span>Our Australian Legacy</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
              Pioneering Safety <span className="text-blue-600 dark:text-blue-400">Since 2009.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed transition-colors font-medium">
              What started as a single car in Bondi has evolved into Australia's most advanced driver education network. DriveSafeMate (DeepDrive) combines the wisdom of veteran instructors with Gemini-driven technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                Join the Network
              </button>
              <button className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                Our safety report
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900 transition-colors aspect-square lg:aspect-video">
              <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Driving Lesson" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl hidden lg:block z-20">
              <p className="text-4xl font-black mb-1">99%</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">First-Time Pass Rate</p>
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-400 rounded-full -z-10 animate-pulse"></div>
          </motion.div>
        </div>

        {/* Impact & Stats Section - NEW EXPANDED SECTION */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4">Our National Impact</h2>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">By The Numbers</h3>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ImpactCard 
              icon="fa-calendar-check" 
              value="15+" 
              label="Years of Excellence" 
              sub="Operating since 2009 across all Australian major cities."
              color="text-blue-600"
              bg="bg-blue-50 dark:bg-blue-900/10"
            />
            <ImpactCard 
              icon="fa-map-marked-alt" 
              value="120+" 
              label="Branch Locations" 
              sub="Local hubs spanning from Perth to the Gold Coast."
              color="text-emerald-600"
              bg="bg-emerald-50 dark:bg-emerald-900/10"
            />
            <ImpactCard 
              icon="fa-id-card" 
              value="450+" 
              label="Certified Instructors" 
              sub="Top-tier professional vendors vetted by state authorities."
              color="text-amber-600"
              bg="bg-amber-50 dark:bg-amber-900/10"
            />
            <ImpactCard 
              icon="fa-user-graduate" 
              value="85,000+" 
              label="Learners Graduated" 
              sub="Aussie students who gained their freedom with us."
              color="text-indigo-600"
              bg="bg-indigo-50 dark:bg-indigo-900/10"
            />
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                To transform the driver education landscape by making safety intuitive, accessible, and smart. We believe that every Australian deserves the highest standard of road-readiness, regardless of their location or background.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <i className="fas fa-eye"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">The Vision</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">A future where zero fatalities are achieved through superior training and predictive AI safety modules.</p>
                </div>
              </div>
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <i className="fas fa-heart"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">The Community</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Supporting rural drivers through scholarship programs and mobile training units in the Outback.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-6">
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl w-full aspect-[4/5] object-cover" alt="" />
                <div className="bg-amber-400 p-8 rounded-3xl">
                   <p className="text-3xl font-black text-slate-900">5.0</p>
                   <p className="text-xs font-bold uppercase text-slate-900/60">Average App Rating</p>
                </div>
             </div>
             <div className="space-y-6 pt-12">
                <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl text-white">
                   <i className="fas fa-shield-alt text-3xl text-blue-400 mb-4"></i>
                   <p className="text-sm font-bold leading-tight">State Gov Approved Training Provider</p>
                </div>
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-xl w-full aspect-[4/5] object-cover" alt="" />
             </div>
          </div>
        </div>

        {/* Global Standards / Certifications */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-center border dark:border-slate-800 transition-colors">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12">Proudly Partnered With</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <i className="fab fa-google text-5xl"></i>
             <i className="fas fa-car-side text-5xl"></i>
             <i className="fas fa-university text-5xl"></i>
             <i className="fas fa-handshake text-5xl"></i>
             <i className="fas fa-medal text-5xl"></i>
          </div>
        </div>

      </div>
    </div>
  );
};

const ImpactCard = ({ icon, value, label, sub, color, bg }: { icon: string; value: string; label: string; sub: string; color: string; bg: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group"
  >
    <div className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="space-y-2">
      <h4 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">{value}</h4>
      <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium pt-4">{sub}</p>
    </div>
  </motion.div>
);

const ValueCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{desc}</p>
  </div>
);

export default AboutPage;
