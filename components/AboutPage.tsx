
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fadeIn bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
              <i className="fas fa-flag-checkered"></i>
              <span>Our Australian Story</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
              Driving Safety <span className="text-blue-600 dark:text-blue-400">Across the Nation.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
              Founded in Sydney, DriveSafeMate Academy was born from a simple mission: to make Australian roads safer by providing superior, accessible, and tech-driven driver education. We combine the local touch of community instructors with the power of modern AI.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">10y+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">50k</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aussies Taught</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 transition-colors">
              <img src="input_file_0.png" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="About Us" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-blue-600 text-white p-8 rounded-3xl shadow-2xl hidden md:block animate-bounce-slow">
              <i className="fas fa-quote-left text-3xl opacity-20 mb-4 block"></i>
              <p className="text-lg font-bold">Safety isn't a goal, it's our standard.</p>
              <p className="text-xs mt-2 opacity-80 uppercase tracking-widest">— The Founder</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">The DriveSafeMate Difference</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard icon="fa-shield-heart" title="Safety Obsessed" desc="Our curriculum goes beyond passing the test; we teach life-saving defensive driving techniques designed for Australian road conditions." />
            <ValueCard icon="fa-mobile-alt" title="Smart Learning" desc="Integrated digital logbooks and Gemini-powered learning paths ensure every lesson is optimized for your personal growth." />
            <ValueCard icon="fa-users" title="Community Focus" desc="We support local communities through driver scholarships and road safety workshops in regional Australian hubs." />
          </div>
        </div>

        {/* The Fleet Section */}
        <div className="bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative mb-32 transition-colors">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black mb-6">Our Fleet & Technology</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Every DriveSafeMate vehicle is chosen for its safety rating and ease of learning. We maintain the highest standards of dual-control integrity across Australia.
              </p>
              <div className="space-y-4">
                <FleetFeature icon="fa-star" title="5-Star ANCAP Safety" desc="All our vehicles carry the highest safety ratings available." />
                <FleetFeature icon="fa-gears" title="Dual Controls" desc="Instructors have full control over brakes and clutch for total safety." />
                <FleetFeature icon="fa-leaf" title="Hybrid Efficiency" desc="We use modern hybrids to reduce our carbon footprint on Aussie roads." />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <img src="input_file_1.png" className="rounded-2xl mb-8 shadow-lg w-full aspect-video object-cover" alt="Branding" />
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/100?random=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="" />)}
                </div>
                <p className="text-sm font-medium text-slate-300">Trusted by over 50,000 students</p>
              </div>
              <p className="italic text-slate-400 text-sm">"The quality of the vehicles and the professionalism of the trainers made all the difference in my learning journey. Passed first go!"</p>
            </div>
          </div>
        </div>

        {/* Instructor Standards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="order-2 lg:order-1 relative">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                   <img src="https://picsum.photos/400/500?random=10" className="rounded-3xl shadow-lg" alt="" />
                   <div className="bg-blue-600 p-6 rounded-3xl text-white">
                      <p className="text-2xl font-black">100%</p>
                      <p className="text-xs uppercase font-bold opacity-80">Background Checked</p>
                   </div>
                </div>
                <div className="space-y-4 pt-12">
                   <div className="bg-emerald-600 p-6 rounded-3xl text-white">
                      <i className="fas fa-check-double text-2xl mb-2"></i>
                      <p className="text-sm font-bold uppercase">WWCC Verified</p>
                   </div>
                   <img src="https://picsum.photos/400/500?random=11" className="rounded-3xl shadow-lg" alt="" />
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">World-Class Mentors</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 transition-colors">
              Becoming a DriveSafeMate instructor is no small feat. We only partner with professionals who share our vision for road safety and patient teaching.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white transition-colors">Vetted and Verified</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Every instructor undergoes Working with Children Checks (WWCC) and police vetting across all Australian states.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-certificate"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white transition-colors">Accredited Trainers</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Certified by state transport authorities (RMS, VicRoads, TMR) and trained in the DriveSafeMate Mentorship Method.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expansion Map Section */}
        <div className="text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-12 lg:p-20 border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Our Australian Footprint</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">We are rapidly expanding to cover every major suburb and regional hub in Australia.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <StateCard label="NSW" cities="Sydney, Newcastle, Wollongong" />
             <StateCard label="VIC" cities="Melbourne, Geelong, Ballarat" />
             <StateCard label="QLD" cities="Brisbane, Gold Coast, Sunshine Coast" />
             <StateCard label="WA" cities="Perth, Fremantle, Bunbury" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{desc}</p>
  </div>
);

const FleetFeature = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex items-start space-x-4">
    <div className="text-blue-500 text-xl mt-1">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  </div>
);

const StateCard = ({ label, cities }: { label: string, cities: string }) => (
  <div className="p-6">
    <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-2">{label}</h3>
    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Available In</p>
    <p className="text-sm text-slate-600 dark:text-slate-300 transition-colors">{cities}</p>
  </div>
);

export default AboutPage;
