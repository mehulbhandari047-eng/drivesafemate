
import React, { useState, useEffect } from 'react';
import { UserRole, Booking, User } from '../types';
import { dbService, SystemLog } from '../services/databaseService';
import { diagnosticService } from '../services/diagnosticService';
import BookingSystem from '../components/BookingSystem';
import TrainingHub from '../components/TrainingHub';
import InstructorCalendar from '../components/InstructorCalendar';
import LicenceGuide from '../components/LicenceGuide';
import SystemAuditRunner from '../components/SystemAuditRunner';
import { generateLearningPath } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardHomeProps {
  role: UserRole;
  user: User;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ role, user }) => {
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'BOOKING'>('DASHBOARD');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [learningModules, setLearningModules] = useState<any[]>([]);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (role === UserRole.ADMIN) {
        const s = await dbService.getAdminStats();
        setStats(s);
      } else if (role === UserRole.INSTRUCTOR) {
        const b = await dbService.getBookings(user.id, UserRole.INSTRUCTOR);
        setBookings(b);
      } else {
        const b = await dbService.getBookings(user.id, UserRole.STUDENT);
        setBookings(b);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (role === UserRole.STUDENT) {
      setLearningModules([
        { title: "Safe Intersections", description: "Mastering city traffic flow.", type: "ONLINE", estimatedHours: 2 },
        { title: "Highway Pilot", description: "Safe merges and speed control.", type: "OFFLINE", estimatedHours: 4 }
      ]);
    }
  }, [role, user.id]);

  const handleGenerateAIPath = async () => {
    setIsGeneratingPath(true);
    const path = await generateLearningPath({
      state: "NSW",
      hoursLogged: 12,
      goals: ["Technical Perfection", "Confidence"]
    });
    if (path) setLearningModules(path);
    setIsGeneratingPath(false);
  };

  const handleBookingComplete = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setCurrentView('DASHBOARD');
  };

  if (currentView === 'BOOKING' && role === UserRole.STUDENT) {
    return <BookingSystem student={user} onBack={() => setCurrentView('DASHBOARD')} onBookingComplete={handleBookingComplete} />;
  }

  return (
    <div className="pt-10 pb-32 px-8 md:px-20 max-w-8xl mx-auto space-y-16 animate-slideUp">
      {showAudit && <SystemAuditRunner onClose={() => setShowAudit(false)} />}
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            {role === UserRole.STUDENT ? "Your Lessons" : role === UserRole.INSTRUCTOR ? "Coach Central" : "Mission Control"}
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            {role === UserRole.STUDENT ? "Manage your road trips and learning progress." : "Your scheduling and earnings dashboard."}
          </p>
        </div>
        {role === UserRole.ADMIN && (
          <button 
            onClick={() => setShowAudit(true)}
            className="px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black flex items-center space-x-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <i className="fas fa-stethoscope"></i>
            <span>System Pulse Test</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-50 dark:bg-slate-900 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : role === UserRole.ADMIN ? (
        <AdminView stats={stats} />
      ) : role === UserRole.INSTRUCTOR ? (
        <InstructorView bookings={bookings} />
      ) : (
        <StudentView 
          bookings={bookings} 
          modules={learningModules} 
          onGeneratePath={handleGenerateAIPath}
          isGenerating={isGeneratingPath}
          onBookNew={() => setCurrentView('BOOKING')}
        />
      )}
    </div>
  );
};

const StudentView = ({ bookings, modules, onGeneratePath, isGenerating, onBookNew }: any) => {
  const upcoming = bookings.filter((b: Booking) => b.status === 'CONFIRMED' || b.status === 'PENDING');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div className="lg:col-span-8 space-y-16">
        <div>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black dark:text-white">Upcoming Experiences</h2>
              <button onClick={onBookNew} className="text-sm font-black text-brand-600 hover:underline">Find more coaches</button>
           </div>
           
           <div className="space-y-6">
             {upcoming.length > 0 ? upcoming.map((b: Booking) => (
               <div key={b.id} className="flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden airbnb-card p-6 gap-8">
                  <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                     <img src={`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                     <div>
                        <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">{b.dateTime}</p>
                        <h3 className="text-2xl font-black dark:text-white">{b.instructorName}</h3>
                        <p className="text-slate-500 font-medium text-sm mt-1">{b.location} • {b.duration} mins • {b.status}</p>
                     </div>
                     <div className="flex items-center space-x-4 mt-6">
                        <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-sm">Message Coach</button>
                        <button className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm hover:bg-slate-50">Reschedule</button>
                     </div>
                  </div>
               </div>
             )) : (
               <div className="p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                  <i className="fas fa-car-rear text-5xl text-slate-200 mb-6"></i>
                  <p className="text-slate-400 font-bold">No upcoming trips yet. Start your journey today!</p>
                  <button onClick={onBookNew} className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black">Explore Instructors</button>
               </div>
             )}
           </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-12 border dark:border-slate-800 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black dark:text-white">Your AI Learning Path</h2>
              <button onClick={onGeneratePath} disabled={isGenerating} className="text-sm font-black text-brand-600 hover:scale-105 transition-all">
                {isGenerating ? 'Analyzing...' : 'Refresh Route'}
              </button>
           </div>
           <TrainingHub modules={modules} />
        </div>
      </div>

      <div className="lg:col-span-4 space-y-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-premium sticky top-24">
           <h2 className="text-2xl font-black mb-4 dark:text-white tracking-tight">Trip Stats</h2>
           <p className="text-slate-500 text-sm font-medium mb-10">Real-time sync with Australian digital logbooks.</p>
           
           <div className="space-y-8">
              <StatRow label="Hours Logged" value="42" target="120" color="bg-brand-400" />
              <StatRow label="Day Hours" value="35" target="100" color="bg-emerald-400" />
              <StatRow label="Night Hours" value="7" target="20" color="bg-indigo-400" />
           </div>

           <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-lg">View Full Logbook</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminView = ({ stats }: { stats: any }) => {
  const [dbStatus, setDbStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'DEGRADED'>('CONNECTED');

  useEffect(() => {
    const check = async () => {
      const s = await dbService.checkConnectivity();
      setDbStatus(s);
    };
    check();
  }, []);

  return (
    <div className="space-y-16 animate-slideUp">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <InsightCard label="Revenue" value={`$${stats?.totalRevenue.toLocaleString()}`} icon="fa-sack-dollar" />
        <InsightCard label="Active Coaches" value={stats?.activeInstructors} icon="fa-id-card" />
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl ${dbStatus === 'CONNECTED' ? 'text-emerald-500' : 'text-rose-500'} mb-8`}><i className="fas fa-database"></i></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Database Integrity</p>
           <p className="text-3xl font-black dark:text-white tracking-tight">{dbStatus === 'CONNECTED' ? 'Live Cloud' : 'Fallback'}</p>
        </div>
        <InsightCard label="Health Score" value="99%" icon="fa-heart-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
            <h2 className="text-2xl font-black mb-6 dark:text-white">Verification Queue</h2>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center justify-between p-4 border border-slate-50 dark:border-slate-800 rounded-2xl">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                       <div><p className="font-bold text-sm dark:text-white">Instructor Applicant #{i}</p><p className="text-xs text-slate-500">VIC Authority Checked</p></div>
                    </div>
                    <button className="text-xs font-black text-brand-600">Review</button>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl overflow-hidden relative">
            <h2 className="text-2xl font-black mb-4 relative z-10">Platform Growth</h2>
            <p className="text-slate-400 text-sm mb-8 relative z-10">User acquisition is up 12% compared to last month. Gemini optimization reduced support tickets by 30%.</p>
            <div className="flex gap-4 relative z-10">
               <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold">+128 Students</div>
               <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold">+12 Coaches</div>
            </div>
            <i className="fas fa-chart-line absolute -bottom-10 -right-10 text-[10rem] opacity-5 -rotate-12"></i>
         </div>
      </div>
    </div>
  );
};

const InstructorView = ({ bookings }: { bookings: Booking[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
    <div className="lg:col-span-4">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-premium mb-8 sticky top-24">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Balance</p>
        <h2 className="text-5xl font-black mb-10 tracking-tighter dark:text-white">$2,450.00</h2>
        <button className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl active:scale-95 transition-all">Instant Payout</button>
        <div className="mt-8 space-y-4">
           <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Pending Clear</span>
              <span className="font-black dark:text-white">$120.00</span>
           </div>
           <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Monthly Gross</span>
              <span className="font-black dark:text-white">$6,240.00</span>
           </div>
        </div>
      </div>
    </div>
    <div className="lg:col-span-8">
       <InstructorCalendar />
    </div>
  </div>
);

const InsightCard = ({ label, value, icon }: any) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl text-slate-900 dark:text-white mb-8`}><i className={`fas ${icon}`}></i></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black dark:text-white tracking-tight">{value}</p>
  </div>
);

const StatRow = ({ label, value, target, color }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
       <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{label}</p>
       <p className="text-lg font-black dark:text-white">{value}<span className="text-slate-400 text-sm">/{target}</span></p>
    </div>
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
       <div className={`h-full ${color}`} style={{ width: `${(parseInt(value)/parseInt(target)) * 100}%` }}></div>
    </div>
  </div>
);

export default DashboardHome;
