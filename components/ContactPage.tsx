
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Have questions about booking, instructors, or our technology? Our team is standing by to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactInfo icon="fa-phone-alt" title="Call Us" detail="1300 DRIVE MATE" sub="Mon-Fri, 8am-6pm AEST" />
            <ContactInfo icon="fa-envelope" title="Email Us" detail="hello@drivesafemate.com.au" sub="We reply within 2 hours" />
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center">
              <i className="fas fa-map-marker-alt text-blue-600 mr-2"></i>
              Major Hubs
            </h3>
            <div className="space-y-4">
              <CityOffice name="Sydney HQ" address="Level 12, 100 Barangaroo Ave, NSW 2000" />
              <CityOffice name="Melbourne Hub" address="727 Collins St, Docklands, VIC 3008" />
              <CityOffice name="Brisbane Center" address="1 Eagle St, Brisbane City, QLD 4000" />
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Send an Inquiry</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                <input type="text" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                <input type="text" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
              <textarea rows={4} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
            </div>
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon, title, detail, sub }: { icon: string; title: string; detail: string; sub: string }) => (
  <div className="space-y-2">
    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
      <i className={`fas ${icon}`}></i>
    </div>
    <h4 className="font-bold text-slate-900">{title}</h4>
    <p className="font-black text-slate-800">{detail}</p>
    <p className="text-xs text-slate-500 font-medium">{sub}</p>
  </div>
);

const CityOffice = ({ name, address }: { name: string; address: string }) => (
  <div className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0 last:pb-0">
    <div>
      <p className="font-bold text-slate-800 text-sm">{name}</p>
      <p className="text-xs text-slate-500">{address}</p>
    </div>
    <button className="text-blue-600 hover:text-blue-800">
      <i className="fas fa-directions"></i>
    </button>
  </div>
);

export default ContactPage;
