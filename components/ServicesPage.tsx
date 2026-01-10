
import React from 'react';

const ServicesPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fadeIn bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-24">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
          <i className="fas fa-tags"></i>
          <span>Transparent Australian Pricing</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">
          Expert Training for <span className="text-emerald-600 dark:text-emerald-400">Every Driver.</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
          From your first time behind the wheel to preparing for the driving test, we have a tailored program designed for your success.
        </p>
      </div>

      {/* Core Services Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        <ServiceCard 
          icon="fa-id-badge" 
          title="L-Plate Foundations" 
          desc="Complete guide for beginners. We cover the basics and log those critical first hours safely."
          price="From $70/hr"
        />
        <ServiceCard 
          icon="fa-flag-checkered" 
          title="Test Preparation" 
          desc="Intensive mock tests and route familiarization to ensure you pass your state test first time."
          price="$150 Mock Pack"
        />
        <ServiceCard 
          icon="fa-globe-americas" 
          title="Overseas Conversions" 
          desc="Fast-track training for international license holders adapting to Australian roads and laws."
          price="Custom Quotes"
        />
        <ServiceCard 
          icon="fa-user-ninja" 
          title="Defensive Driving" 
          desc="Advanced car control techniques, hazard management, and emergency reactions."
          price="$199 Full Day"
        />
      </div>

      {/* Pricing Tiers Section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 transition-colors">Popular Learning Packages</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Save up to $200 with our bundled hours.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PriceTier 
              title="Kickstarter" 
              price="$325" 
              hours="5 Hours" 
              features={["Instructor pickup & drop-off", "Gemini AI Learning Path", "Digital logbook sync", "Automatic or Manual"]}
              savings="Save $25"
            />
            <PriceTier 
              title="Pro Driver" 
              price="$630" 
              hours="10 Hours" 
              featured
              features={["All Kickstarter features", "1x Mock Practical Test", "Free test route map", "Hazard Perception simulator"]}
              savings="Save $70"
            />
            <PriceTier 
              title="Ultimate Journey" 
              price="$1,200" 
              hours="20 Hours" 
              features={["All Pro Driver features", "Night driving specialist session", "Guaranteed instructor matching", "24/7 priority support"]}
              savings="Save $200"
            />
          </div>
        </div>
      </div>

      {/* Specialized Programs Section */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">Specialized Support Programs</h2>
              <div className="space-y-6">
                 <ProgramRow 
                    icon="fa-handshake-angle" 
                    title="NDIS Approved Provider" 
                    desc="We offer specialized driving lessons for NDIS participants with vehicles modified for accessibility and instructors trained in disability support."
                 />
                 <ProgramRow 
                    icon="fa-briefcase" 
                    title="Corporate Fleet Safety" 
                    desc="Reduce insurance premiums and improve staff safety with our corporate assessments and defensive driving workshops for Australian businesses."
                 />
                 <ProgramRow 
                    icon="fa-key" 
                    title="Keys2Drive Free Lessons" 
                    desc="Proud partner in the national Keys2Drive initiative. Check your eligibility for a government-funded free driving lesson with a supervisor."
                 />
              </div>
           </div>
           <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-4">The NDIS Advantage</h3>
                 <p className="text-slate-400 mb-8 leading-relaxed">We work closely with plan managers and occupational therapists to ensure a smooth transition to road independence for all our students.</p>
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center space-x-2 text-sm">
                       <i className="fas fa-check-circle text-emerald-500"></i>
                       <span>Adaptive vehicle controls available</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                       <i className="fas fa-check-circle text-emerald-500"></i>
                       <span>Detailed OT progress reporting</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                       <i className="fas fa-check-circle text-emerald-500"></i>
                       <span>Specialized sensory-friendly instructors</span>
                    </li>
                 </ul>
                 <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all">Learn More About NDIS</button>
              </div>
              <i className="fas fa-wheelchair absolute -bottom-10 -right-10 text-[12rem] opacity-5 -rotate-12"></i>
           </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          <FAQItem question="What happens if I need to cancel my lesson?" answer="We have a 24-hour cancellation policy. Lessons cancelled with more than 24 hours notice can be rescheduled or refunded for free. Late cancellations incur a 50% fee." />
          <FAQItem question="Do you provide the car for the driving test?" answer="Yes! We offer a Test Day Package which includes a warm-up lesson and the use of the instructor's car for your practical driving test." />
          <FAQItem question="Can I choose between automatic and manual?" answer="Absolutely. We have a wide network of instructors specializing in both. You can filter by transmission when booking." />
          <FAQItem question="How do I log my hours for the NSW/VIC logbook?" answer="Our app syncs directly with major digital logbooks. Your instructor will verify your hours at the end of every lesson." />
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, price }: { icon: string; title: string; desc: string; price: string }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all group">
    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 transition-colors">{desc}</p>
    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight uppercase transition-colors">{price}</p>
  </div>
);

const PriceTier = ({ title, price, hours, features, savings, featured }: { title: string, price: string, hours: string, features: string[], savings: string, featured?: boolean }) => (
  <div className={`p-10 rounded-[2.5rem] border transition-all relative ${
    featured 
    ? 'bg-blue-600 border-blue-500 text-white shadow-2xl scale-105 z-10' 
    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white'
  }`}>
    {featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>}
    <div className="text-center mb-8">
      <h3 className={`text-xl font-bold mb-2 ${featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h3>
      <p className={`text-4xl font-black mb-1 ${featured ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>{price}</p>
      <p className={`text-sm font-bold opacity-80 ${featured ? 'text-blue-100' : 'text-slate-500'}`}>{hours}</p>
    </div>
    <ul className="space-y-4 mb-10">
      {features.map((f, i) => (
        <li key={i} className="flex items-start space-x-3 text-sm">
          <i className={`fas fa-check-circle mt-0.5 ${featured ? 'text-blue-200' : 'text-emerald-500'}`}></i>
          <span className={featured ? 'text-blue-50' : 'text-slate-600 dark:text-slate-400'}>{f}</span>
        </li>
      ))}
    </ul>
    <div className="mt-auto">
      <div className={`text-center py-2 px-4 rounded-xl font-black text-xs uppercase mb-4 ${featured ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
        {savings}
      </div>
      <button className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
        featured 
        ? 'bg-white text-blue-600 hover:bg-slate-50 shadow-blue-800/20' 
        : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800'
      }`}>
        Select Package
      </button>
    </div>
  </div>
);

const ProgramRow = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex items-start space-x-5 group">
    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{desc}</p>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
        <span className="font-bold text-slate-800 dark:text-white transition-colors">{question}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${open ? 'rotate-180' : ''}`}></i>
      </button>
      {open && <div className="p-6 pt-0 text-sm text-slate-500 dark:text-slate-400 animate-fadeIn">{answer}</div>}
    </div>
  );
}

export default ServicesPage;
