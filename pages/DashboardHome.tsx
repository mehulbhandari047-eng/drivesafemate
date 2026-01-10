
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
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (role === UserRole.ADMIN) {
        const s = await dbService.getAdminStats();
        setStats(s);
        setIsCloudLive(true);
      } else if (role === UserRole.INSTRUCTOR) {
        const b = await dbService.getBookings(user.id, UserRole.INSTRUCTOR);
        setBookings(b);
        setIsCloudLive(true);
      } else {
        const b = await dbService.getBookings(user.id, UserRole.STUDENT);
        setBookings(b);
        setIsCloudLive(true);
      }
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
        { title: "Pre-Drive Checks", description: "Australian vehicle safety standards.", type: "ONLINE", estimatedHours: 1 },
        { title: "Residential Turns", description: "Mastering left and right turns in suburbs.", type: "OFFLINE", estimatedHours: 2 }
      ]);
    }
  }, [role, user.id]);

  const handleGenerateAIPath = async () => {
    setIsGeneratingPath(true);
    const path = await generateLearningPath({
      state: "NSW",
      hoursLogged: 10,
      goals: ["Pass P-Plates", "Manual Confidence"]
    });
    if (path) setLearningModules(path);
    setIsGeneratingPath(false);
  };

  const handleBookingComplete = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setCurrentView('DASHBOARD');
  };

  const triggerCancelFlow = (booking: Booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await dbService.updateBookingStatus(bookingToCancel.id, 'CANCELLED');
      await fetchData();
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (error) {
      alert("Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (currentView === 'BOOKING' && role === UserRole.STUDENT) {
    return <BookingSystem student={user} onBack={() => setCurrentView('DASHBOARD')} onBookingComplete={handleBookingComplete} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {role === UserRole.ADMIN ? "Admin Hub 🛡️" : role === UserRole.INSTRUCTOR ? "Instructor Portal 👋" : "Learning Dashboard 👋"}
            </h1>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-1 ${isCloudLive ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${isCloudLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
               <span>{isCloudLive ? 'Cloud Connected' : 'Local Fallback'}</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {role === UserRole.ADMIN 
              ? `System Management Panel. Signed in as ${user.name}` 
              : role === UserRole.INSTRUCTOR 
              ? `G'day ${user.name}, manage your professional earnings.` 
              : `Welcome back ${user.name}, track your road to independence.`}
          </p>
        </div>
        
        {role === UserRole.STUDENT && (
          <button 
            onClick={() => setCurrentView('BOOKING')}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black shadow-lg shadow-amber-900/10 transition-all flex items-center space-x-2"
          >
            <i className="fas fa-steering-wheel"></i>
            <span>Book Practical Lesson</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : role === UserRole.ADMIN ? (
        <AdminPortal stats={stats} />
      ) : role === UserRole.INSTRUCTOR ? (
        <InstructorContent bookings={bookings} />
      ) : (
        <StudentContent 
          bookings={bookings} 
          onCancel={triggerCancelFlow} 
          modules={learningModules} 
          onGeneratePath={handleGenerateAIPath}
          isGenerating={isGeneratingPath}
        />
      )}

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && bookingToCancel && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 text-center border dark:border-slate-800">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  <i className="fas fa-calendar-times"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Cancellation Policy</h2>
                <div className="space-y-4 mb-10 text-left">
                  <PolicyItem icon="fa-clock" title="24-Hour Notice Required" desc="Free cancellations are only available if requested more than 24 hours before the start time." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setShowCancelModal(false)} className="py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl">Keep It</button>
                  <button onClick={confirmCancellation} className="py-4 bg-red-600 text-white font-black rounded-2xl">Confirm Cancel</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const AdminPortal = ({ stats }: { stats: any }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HEALTH' | 'DATABASE'>('OVERVIEW');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [rawBookings, setRawBookings] = useState<Booking[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<{ summary: string, status: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const unsub = dbService.subscribeToLogs(setLogs);
    return unsub;
  }, []);

  useEffect(() => {
    if (activeTab === 'DATABASE') {
      dbService.getAllBookings().then(setRawBookings);
    }
  }, [activeTab]);

  const handleSimulate = () => dbService.simulateActivity();
  
  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeSystemHealth(logs);
    if (result) setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          {['OVERVIEW', 'HEALTH', 'DATABASE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-3">
            <button 
              onClick={handleSimulate}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center space-x-2"
            >
              <i className="fas fa-vial"></i>
              <span>Simulate Traffic</span>
            </button>
            <button 
              onClick={handleAiAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isAnalyzing ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-robot"></i>}
              <span>Gemini Health Report</span>
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {aiAnalysis && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`p-6 rounded-3xl border ${
                aiAnalysis.status === 'Healthy' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400' :
                aiAnalysis.status === 'Warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/50 text-amber-800 dark:text-amber-400' :
                'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/50 text-red-800 dark:text-red-400'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-white shadow-sm flex-shrink-0`}>
                    <i className="fas fa-robot"></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-black text-sm uppercase tracking-widest">AI System Assessment</h4>
                      <span className="px-2 py-0.5 rounded-full bg-current bg-opacity-10 text-[10px] font-black">{aiAnalysis.status}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{aiAnalysis.summary}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon="fa-dollar-sign" color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" label="Total GMV" value={`$${stats?.totalRevenue.toLocaleString()}`} />
              <StatCard icon="fa-percentage" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" label="Platform Fees" value={`$${stats?.platformFees.toLocaleString()}`} />
              <StatCard icon="fa-users" color="text-indigo-500" bg="bg-indigo-50 dark:bg-indigo-900/20" label="Instructors" value={stats?.activeInstructors + ""} />
              <StatCard icon="fa-user-clock" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/20" label="Pending Apps" value={stats?.pendingVerifications + ""} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 shadow-sm">
                 <h3 className="text-xl font-black dark:text-white mb-6">Instructor Verification Queue</h3>
                 <div className="space-y-4">
                   {[
                     { name: "James Miller", location: "Perth, WA", status: "Reviewing Docs" },
                     { name: "Emily Watson", location: "Adelaide, SA", status: "Police Check" }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                       <div><p className="font-bold dark:text-white">{item.name}</p><p className="text-xs text-slate-500">{item.location}</p></div>
                       <span className="text-[10px] font-black text-amber-500 uppercase bg-amber-50 px-2 py-1 rounded-lg">{item.status}</span>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 shadow-sm">
                 <h3 className="text-xl font-black dark:text-white mb-6">Cloud Status</h3>
                 <div className="p-6 rounded-2xl border bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm"><i className="fas fa-cloud"></i></div>
                    <div><p className="font-bold dark:text-white">Live Connection</p><p className="text-sm text-slate-500">Supabase DB Sync is stable.</p></div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'HEALTH' && (
          <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white flex items-center space-x-3">
                  <i className="fas fa-terminal text-emerald-500"></i>
                  <span>System Operation Logs</span>
                </h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Streaming Real-time Traces</span>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide font-mono text-xs">
              {logs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className="text-emerald-500/50 shrink-0">{log.traceId}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 text-center w-24 ${
                    log.service === 'SUPABASE' ? 'bg-emerald-500/20 text-emerald-500' :
                    log.service === 'GEMINI' ? 'bg-indigo-500/20 text-indigo-500' : 
                    log.service === 'PAYMENT' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-300'
                  }`}>{log.service}</span>
                  <span className="text-white font-bold shrink-0">{log.action}</span>
                  <span className={`font-black shrink-0 ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'}`}>{log.status}</span>
                  {log.details && <span className="text-slate-400 opacity-50 text-[10px] truncate flex-1">{log.details}</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'DATABASE' && (
          <motion.div key="database" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black dark:text-white">Raw Booking Table</h3>
                <span className="text-xs font-bold text-slate-400">{rawBookings.length} Records found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="pb-4 px-4">Booking ID</th>
                      <th className="pb-4 px-4">Student</th>
                      <th className="pb-4 px-4">Instructor</th>
                      <th className="pb-4 px-4">Date/Time</th>
                      <th className="pb-4 px-4">Status</th>
                      <th className="pb-4 px-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {rawBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4 font-mono text-[10px] text-slate-500">#{b.id}</td>
                        <td className="py-4 px-4 font-bold dark:text-white">{b.studentName}</td>
                        <td className="py-4 px-4 font-bold dark:text-white">{b.instructorName}</td>
                        <td className="py-4 px-4 text-xs text-slate-500">{b.dateTime}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                            b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' :
                            b.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                          }`}>{b.status}</span>
                        </td>
                        <td className="py-4 px-4 font-black text-amber-500">${b.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InstructorContent = ({ bookings }: { bookings: Booking[] }) => {
  const earnings = bookings.filter(b => b.status === 'COMPLETED').reduce((acc, b) => acc + b.price, 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
           <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">Estimated Earnings</p>
           <h2 className="text-4xl font-black mb-1">${earnings + 1450}.00</h2>
           <p className="text-slate-400 text-sm mb-6 font-medium">For the current billing cycle</p>
           <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-colors">Request Payout</button>
           <i className="fas fa-wallet absolute -bottom-10 -right-10 text-[10rem] opacity-5 -rotate-12"></i>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 shadow-sm">
           <h3 className="text-lg font-black dark:text-white mb-4">Upcoming Student Sessions</h3>
           <div className="space-y-4">
              {bookings.length > 0 ? bookings.map(b => (
                 <div key={b.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                    <p className="text-[10px] font-black text-amber-500 uppercase mb-1">{b.dateTime}</p>
                    <p className="font-bold dark:text-white">{b.studentName || 'Student Session'}</p>
                    <p className="text-xs text-slate-500">{b.location}</p>
                 </div>
              )) : ( <div className="text-center py-6 text-slate-400 text-sm italic">No sessions found.</div> )}
           </div>
        </div>
      </div>
      <div className="lg:col-span-8"> <InstructorCalendar /> </div>
    </div>
  );
};

const StudentContent = ({ bookings, onCancel, modules, onGeneratePath, isGenerating }: any) => {
  const upcoming = bookings.filter((b: Booking) => b.status === 'CONFIRMED' || b.status === 'PENDING');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <LicenceGuide state="NSW" currentStage="Learner" />
        <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div><h3 className="text-2xl font-black dark:text-white">DeepDrive AI Pathway</h3><p className="text-slate-500 font-medium">Powered by Google Gemini.</p></div>
              <button onClick={onGeneratePath} disabled={isGenerating} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2">
                {isGenerating ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
                <span>{isGenerating ? 'Analyzing...' : 'Generate Path'}</span>
              </button>
           </div>
           <TrainingHub modules={modules} />
        </div>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 shadow-sm">
          <h3 className="font-bold text-lg dark:text-white mb-6">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.map((b: Booking) => (
              <div key={b.id} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700 relative group">
                <p className="text-[10px] font-black text-amber-500 uppercase mb-1">{b.dateTime}</p>
                <h4 className="font-bold text-slate-900 dark:text-white">{b.instructorName}</h4>
                <p className="text-xs text-slate-500 mb-4">{b.location}</p>
                <button onClick={() => onCancel(b)} className="w-full py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:border-red-500 hover:text-red-500 transition-all">Request Cancel</button>
              </div>
            )) : ( <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl"> <p className="text-slate-400 text-sm italic font-medium">No bookings found.</p> </div> )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, color, bg, label, value }: { icon: string; color: string; bg: string; label: string; value: string }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 p-6 flex items-center space-x-5">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-xl`}> <i className={`fas ${icon} ${color}`}></i> </div>
    <div> <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{label}</p> <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p> </div>
  </div>
);

const PolicyItem = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 flex items-start space-x-4">
    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0"> <i className={`fas ${icon} text-sm`}></i> </div>
    <div> <h4 className="text-sm font-black text-slate-900 dark:text-white">{title}</h4> <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p> </div>
  </div>
);

export default DashboardHome;
