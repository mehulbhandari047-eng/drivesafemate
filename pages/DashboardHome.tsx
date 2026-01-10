
import React, { useState, useEffect } from 'react';
import { UserRole, Booking, Instructor, User } from '../types';
import { dbService, SystemLog } from '../services/databaseService';
import { analyzeSystemHealth } from '../services/geminiService';
import BookingSystem from '../components/BookingSystem';
import LicenceGuide from '../components/LicenceGuide';
import TrainingHub from '../components/TrainingHub';
import InstructorCalendar from '../components/InstructorCalendar';
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
  const [isCloudLive, setIsCloudLive] = useState(false);
  const [learningModules, setLearningModules] = useState<any[]>([]);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

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
      setIsCloudLive(true);
    } catch (error) {
      setIsCloudLive(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (role === UserRole.STUDENT) {
      setLearningModules([
        { title: "Essential Checks", description: "Pre-drive safety inspection protocols.", type: "ONLINE", estimatedHours: 1 },
        { title: "Urban Navigation", description: "Navigating complex city intersections.", type: "OFFLINE", estimatedHours: 3 }
      ]);
    }
  }, [role, user.id]);

  const handleGenerateAIPath = async () => {
    setIsGeneratingPath(true);
    const path = await generateLearningPath({
      state: "NSW",
      hoursLogged: 10,
      goals: ["Safety First", "Manual Expertise"]
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
    <div className="space-y-10 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {role === UserRole.ADMIN ? "Console" : role === UserRole.INSTRUCTOR ? "Coach Central" : "My Academy"}
            </h1>
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${isCloudLive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
               <span className={`w-2 h-2 rounded-full ${isCloudLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
               <span>{isCloudLive ? 'Secure Link' : 'Syncing'}</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            {role === UserRole.ADMIN ? "Overseeing Australian road safety operations." : `G'day, ${user.name.split(' ')[0]}. Here's your journey summary.`}
          </p>
        </div>
        
        {role === UserRole.STUDENT && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('BOOKING')}
            className="bg-amber-400 text-slate-900 px-8 py-4 rounded-2xl font-black shadow-xl shadow-amber-400/20 transition-all flex items-center space-x-3"
          >
            <i className="fas fa-steering-wheel text-lg"></i>
            <span>Schedule Practical Lesson</span>
          </motion.button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      ) : role === UserRole.ADMIN ? (
        <AdminPortal stats={stats} />
      ) : role === UserRole.INSTRUCTOR ? (
        <InstructorContent bookings={bookings} />
      ) : (
        <StudentContent 
          bookings={bookings} 
          modules={learningModules} 
          onGeneratePath={handleGenerateAIPath}
          isGenerating={isGeneratingPath}
          onShowHistory={() => setShowHistoryModal(true)}
        />
      )}

      {/* Booking History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 40 }} 
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-12 flex flex-col max-h-[85vh] border dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Activity Log</h2>
                  <p className="text-sm text-slate-500 font-medium">Historical record of all driving sessions.</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <motion.div 
                      key={b.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border dark:border-slate-700/50 flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                          b.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 
                          b.status === 'CANCELLED' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          <i className={`fas ${b.status === 'COMPLETED' ? 'fa-check-circle' : b.status === 'CANCELLED' ? 'fa-circle-xmark' : 'fa-clock'}`}></i>
                        </div>
                        <div>
                          <p className="font-black dark:text-white group-hover:text-amber-500 transition-colors">{b.instructorName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.dateTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          b.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 
                          b.status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'
                        }`}>
                          {b.status}
                        </span>
                        <p className="text-sm font-black text-slate-500 dark:text-slate-400 mt-2">${b.price}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed dark:border-slate-800">
                    <i className="fas fa-box-open text-5xl text-slate-300 mb-6"></i>
                    <p className="text-slate-500 font-bold italic tracking-tight">Your history is clear. Ready to drive?</p>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-8 border-t dark:border-slate-800">
                 <button 
                   onClick={() => setShowHistoryModal(false)}
                   className="w-full py-5 bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 rounded-2xl font-black tracking-tight transition-all shadow-xl"
                 >
                   Return to Dashboard
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS REFINED ---

const AdminPortal = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <StatCard icon="fa-sack-dollar" color="text-emerald-500" bg="bg-emerald-500/10" label="Platform Revenue" value={`$${stats?.totalRevenue.toLocaleString()}`} />
    <StatCard icon="fa-user-tie" color="text-amber-500" bg="bg-amber-500/10" label="Active Coaches" value={stats?.activeInstructors + ""} />
    <StatCard icon="fa-graduation-cap" color="text-indigo-500" bg="bg-indigo-500/10" label="Active Learners" value={stats?.activeStudents + ""} />
    <StatCard icon="fa-shield-check" color="text-blue-500" bg="bg-blue-500/10" label="Success Rate" value="98.2%" />
  </div>
);

const StudentContent = ({ bookings, modules, onGeneratePath, isGenerating, onShowHistory }: any) => {
  const upcoming = bookings.filter((b: Booking) => b.status === 'CONFIRMED' || b.status === 'PENDING');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-10">
        <LicenceGuide state="NSW" currentStage="Learner" />
        
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 p-10 shadow-sm overflow-hidden relative">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 relative z-10">
              <div>
                <h3 className="text-3xl font-black dark:text-white tracking-tight">AI Pathway</h3>
                <p className="text-slate-500 font-medium">Smart syllabus powered by Google Gemini.</p>
              </div>
              <button 
                onClick={onGeneratePath} 
                disabled={isGenerating} 
                className="bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center space-x-3 shadow-lg disabled:opacity-50 transition-all hover:scale-105"
              >
                {isGenerating ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                <span>{isGenerating ? 'Analyzing...' : 'Refresh Route'}</span>
              </button>
           </div>
           <TrainingHub modules={modules} />
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
      
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 p-10 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl dark:text-white">Coming Up</h3>
            <button 
              onClick={onShowHistory}
              className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest hover:underline"
            >
              History
            </button>
          </div>
          <div className="space-y-6">
            {upcoming.length > 0 ? upcoming.map((b: Booking) => (
              <div key={b.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border dark:border-slate-700 relative group transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{b.dateTime}</p>
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                </div>
                <h4 className="font-black text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">{b.instructorName}</h4>
                <p className="text-xs text-slate-500 font-medium mb-6">{b.location}</p>
                <div className="flex gap-2">
                   <button className="flex-1 py-3 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-all">Cancel</button>
                   <button className="flex-1 py-3 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase">Reschedule</button>
                </div>
              </div>
            )) : ( 
              <div className="text-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]"> 
                <p className="text-slate-400 text-sm font-bold italic">No active sessions.</p> 
              </div> 
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">Logbook Plus</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">We automatically verify your digital logbook hours after every session.</p>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black uppercase text-slate-500">Hours Target</span>
                 <span className="text-xs font-black text-amber-400">42/120 HRS</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} className="h-full bg-amber-400 shadow-lg shadow-amber-400/20"></motion.div>
              </div>
           </div>
           <i className="fas fa-book-sparkles absolute -bottom-8 -right-8 text-9xl opacity-5 -rotate-12"></i>
        </div>
      </div>
    </div>
  );
};

const InstructorContent = ({ bookings }: { bookings: Booking[] }) => {
  const earnings = bookings.filter(b => b.status === 'COMPLETED').reduce((acc, b) => acc + b.price, 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
             <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">Gross Earnings</p>
             <h2 className="text-5xl font-black mb-2 tracking-tighter">${earnings + 1250}.00</h2>
             <p className="text-slate-400 text-sm font-medium mb-10">Current cycle: June 1st - June 14th</p>
             <button className="w-full py-5 bg-amber-400 text-slate-900 rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20">Withdraw to Bank Account</button>
           </div>
           <i className="fas fa-coins absolute -bottom-10 -right-10 text-[15rem] opacity-5 -rotate-12"></i>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 p-10 shadow-sm">
           <h3 className="text-xl font-black dark:text-white mb-8">Next in Line</h3>
           <div className="space-y-6">
              {bookings.length > 0 ? bookings.slice(0, 3).map(b => (
                 <div key={b.id} className="flex items-center space-x-5 p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border dark:border-slate-700">
                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center font-black text-amber-500 shadow-sm">{b.studentName?.[0]}</div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">{b.dateTime.split(' ')[1]}</p>
                       <p className="font-black dark:text-white text-sm">{b.studentName}</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center"><i className="fas fa-chevron-right text-[10px]"></i></button>
                 </div>
              )) : ( <p className="text-center py-8 text-slate-400 font-medium italic">Empty schedule.</p> )}
           </div>
        </div>
      </div>
      <div className="lg:col-span-8"> <InstructorCalendar /> </div>
    </div>
  );
};

const StatCard = ({ icon, color, bg, label, value }: { icon: string; color: string; bg: string; label: string; value: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border dark:border-slate-800 p-8 flex items-center space-x-6"
  >
    <div className={`w-16 h-16 ${bg} rounded-3xl flex items-center justify-center text-2xl shadow-inner`}> <i className={`fas ${icon} ${color}`}></i> </div>
    <div> <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p> <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p> </div>
  </motion.div>
);

export default DashboardHome;
