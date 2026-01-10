
import React, { useState, useEffect } from 'react';
import { UserRole, Booking, AdminStats, Instructor } from '../types';
import { generateLearningPath } from '../services/geminiService';
import { emailService } from '../services/emailService';
import BookingSystem from '../components/BookingSystem';
import LicenceGuide from '../components/LicenceGuide';
import TrainingHub from '../components/TrainingHub';
import InstructorCalendar from '../components/InstructorCalendar';

interface DashboardHomeProps {
  role: UserRole;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ role }) => {
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'BOOKING' | 'AVAILABILITY' | 'USERS'>('DASHBOARD');
  const [studentBookings, setStudentBookings] = useState<Booking[]>([
    {
      id: 'b1',
      studentId: 's1',
      instructorId: 'i1',
      instructorName: 'Dave Smith',
      dateTime: 'Tomorrow @ 10:00 AM',
      status: 'CONFIRMED',
      duration: 60,
      location: 'Bondi Junction',
      price: 70
    },
    {
      id: 'h1',
      studentId: 's1',
      instructorId: 'i2',
      instructorName: 'Sarah Chen',
      dateTime: '15 Oct 2023 @ 02:00 PM',
      status: 'COMPLETED',
      duration: 60,
      location: 'Randwick',
      price: 85
    },
    {
      id: 'h2',
      studentId: 's1',
      instructorId: 'i3',
      instructorName: 'Marcus Aurelius',
      dateTime: '02 Oct 2023 @ 09:00 AM',
      status: 'CANCELLED',
      duration: 60,
      location: 'Sydney CBD',
      price: 70
    }
  ]);

  const handleBookingComplete = (newBooking: Booking) => {
    setStudentBookings(prev => [newBooking, ...prev]);
  };

  const handleCancelBooking = (booking: Booking) => {
    const policyMsg = "DriveSafeMate Policy: Lessons cancelled with less than 24 hours notice may incur a 50% late cancellation fee.\n\nAre you sure you want to cancel this lesson?";
    if (window.confirm(policyMsg)) {
      setStudentBookings(prev => 
        prev.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b)
      );
      emailService.sendCancellationEmail('john.doe@example.com', booking);
    }
  };

  if (currentView === 'BOOKING' && role === UserRole.STUDENT) {
    return <BookingSystem onBack={() => setCurrentView('DASHBOARD')} onBookingComplete={handleBookingComplete} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            {role === UserRole.ADMIN ? "Admin Command Center 🛡️" : role === UserRole.INSTRUCTOR ? "G'day, Dave 👋" : "G'day, John 👋"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
            {role === UserRole.ADMIN ? "Overseeing Australia's safest driving community." : role === UserRole.INSTRUCTOR ? "Your teaching schedule is looking solid." : "Your road to a full licence starts here."}
          </p>
        </div>
        <div className="flex items-center space-x-3">
           {role === UserRole.STUDENT && (
            <button 
              onClick={() => setCurrentView('BOOKING')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/40 transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5"
            >
              <i className="fas fa-steering-wheel"></i>
              <span>Book Practical Lesson</span>
            </button>
          )}
          {role === UserRole.ADMIN && (
            <div className="flex space-x-2">
              <button onClick={() => setCurrentView('DASHBOARD')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${currentView === 'DASHBOARD' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>Stats</button>
              <button onClick={() => setCurrentView('USERS')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${currentView === 'USERS' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>Management</button>
            </div>
          )}
        </div>
      </div>

      {role === UserRole.STUDENT && <StudentDashboard bookings={studentBookings} onCancel={handleCancelBooking} />}
      {role === UserRole.INSTRUCTOR && <InstructorDashboard />}
      {role === UserRole.ADMIN && <AdminDashboard view={currentView} />}
    </div>
  );
};

const AdminDashboard = ({ view }: { view: string }) => {
  const stats: AdminStats = {
    totalRevenue: 124500,
    platformFees: 18675,
    activeInstructors: 42,
    activeStudents: 856,
    pendingVerifications: 5,
    bookingsThisMonth: 312
  };

  const [pendingInstructors, setPendingInstructors] = useState<any[]>([
    { id: 'p1', name: 'Robert Fox', region: 'Parramatta, NSW', applied: '2 days ago', doc: 'WWCC Pending' },
    { id: 'p2', name: 'Jenny Wilson', region: 'St Kilda, VIC', applied: '5 hours ago', doc: 'Ready for Review' }
  ]);

  if (view === 'USERS') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 dark:text-white">Instructor Verifications</h3>
            <div className="space-y-4">
              {pendingInstructors.map(inst => (
                <div key={inst.id} className="flex items-center justify-between p-4 rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-bold">
                      {inst.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">{inst.name}</h4>
                      <p className="text-xs text-slate-500">{inst.region} • Applied {inst.applied}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-orange-100 text-orange-600 uppercase mr-4">{inst.doc}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Verify</button>
                    <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Platform Health</h3>
            <div className="space-y-4">
               <HealthCheck label="Payment Gateway" status="Operational" />
               <HealthCheck label="Gemini AI Service" status="Operational" />
               <HealthCheck label="Database" status="99.9% Up" />
               <HealthCheck label="Email Notification" status="Operational" />
            </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="fa-dollar-sign" color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/20" label="Total GMV (AUD)" value={`$${stats.totalRevenue.toLocaleString()}`} />
        <StatCard icon="fa-percentage" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" label="Platform Earnings" value={`$${stats.platformFees.toLocaleString()}`} />
        <StatCard icon="fa-users" color="text-indigo-500" bg="bg-indigo-50 dark:bg-indigo-900/20" label="Active Users" value={stats.activeStudents + stats.activeInstructors + ""} />
        <StatCard icon="fa-user-clock" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/20" label="Pending Apps" value={stats.pendingVerifications + ""} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold dark:text-white">Recent Transactions</h3>
            <button className="text-sm font-bold text-blue-600">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase border-b dark:border-slate-800">
                  <th className="pb-4">Transaction ID</th>
                  <th className="pb-4">Instructor</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="text-sm dark:text-slate-300">
                    <td className="py-4 font-medium text-slate-900 dark:text-white">#TRX-9482{i}</td>
                    <td className="py-4">Marcus Aurelius</td>
                    <td className="py-4 font-bold">$70.00</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">Success</span>
                    </td>
                    <td className="py-4 text-slate-500">Oct {i + 10}, 2023</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
            <h4 className="font-bold mb-4">State Distribution</h4>
            <div className="space-y-4">
              <StateBar label="NSW" value={45} />
              <StateBar label="VIC" value={30} />
              <StateBar label="QLD" value={15} />
              <StateBar label="WA" value={10} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-6 shadow-sm">
            <h4 className="font-bold mb-4 dark:text-white">Quick System Actions</h4>
            <div className="space-y-2">
              <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all text-left px-4">Broadcast System Message</button>
              <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all text-left px-4">Flush Cache / Rebuild SEO</button>
              <button className="w-full py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all text-left px-4">Emergency Lockdown</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthCheck = ({ label, status }: { label: string; status: string }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-xs font-bold text-emerald-500 flex items-center">
      <i className="fas fa-circle text-[6px] mr-2"></i>
      {status}
    </span>
  </div>
);

const StateBar = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold text-slate-400">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const StudentDashboard = ({ bookings, onCancel }: { bookings: Booking[]; onCancel: (b: Booking) => void }) => {
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [loadingPath, setLoadingPath] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  useEffect(() => {
    const fetchPath = async () => {
      setLoadingPath(true);
      const path = await generateLearningPath({
        state: "NSW",
        hoursLogged: 45,
        goals: ["Parallel Parking", "Night Driving", "City Traffic"]
      });
      if (path) setLearningPath(path);
      setLoadingPath(false);
    };
    fetchPath();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard icon="fa-clock" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" label="Logged Hours" value="45 / 120" />
          <StatCard icon="fa-book-reader" color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/20" label="Theory Complete" value="65%" />
          <StatCard icon="fa-calendar-check" color="text-indigo-500" bg="bg-indigo-50 dark:bg-indigo-900/20" label="Next Lesson" value={upcomingBookings.length > 0 ? "24h left" : "N/A"} />
        </div>

        <LicenceGuide state="NSW" currentStage="Learner" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Your Training Hub</h3>
            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View All Modules</button>
          </div>
          {loadingPath ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-12 flex flex-col items-center justify-center space-y-4 transition-colors">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium">Gemini is curating your modules...</p>
            </div>
          ) : (
            <TrainingHub modules={learningPath} />
          )}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg dark:text-white">Upcoming Schedule</h3>
            <button onClick={() => setShowHistoryModal(true)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center">
              <i className="fas fa-history mr-1"></i>
              History
            </button>
          </div>
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? upcomingBookings.slice(0, 3).map((booking, i) => (
              <div key={booking.id} className={`p-4 border rounded-2xl transition-all group ${i === 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/40 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-3">
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest ${i === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{booking.dateTime}</p>
                  <button onClick={() => onCancel(booking)} className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-red-500 dark:text-red-400 hover:underline transition-opacity">
                    Cancel Lesson
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm transition-colors">On-Road Practical Lesson</h4>
                <div className="flex items-center mt-4 space-x-3">
                  <img src={`https://i.pravatar.cc/100?u=${booking.instructorId}`} className="w-8 h-8 rounded-full border dark:border-slate-700 shadow-sm" alt="Inst." />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">{booking.instructorName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 transition-colors">{booking.location}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <i className="fas fa-calendar-times text-slate-200 text-4xl mb-3 block"></i>
                <p className="text-sm text-slate-400 font-medium">No upcoming lessons.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
           <h4 className="font-bold mb-2">Did you know?</h4>
           <p className="text-xs text-slate-400 leading-relaxed mb-4">Passing your driving test on the first try is 40% more likely if you complete at least 10 hours with a certified instructor.</p>
           <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold">
              <span>Learn more about safety stats</span>
              <i className="fas fa-arrow-right"></i>
           </div>
           <i className="fas fa-lightbulb absolute -bottom-4 -right-4 text-7xl opacity-5 -rotate-12"></i>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[85vh] transition-colors duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center transition-colors">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Booking History</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">Overview of your journey with DriveSafeMate.</p>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                          booking.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          <i className={`fas ${booking.status === 'COMPLETED' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm transition-colors">{booking.dateTime}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-500 font-medium transition-colors">Instructor: {booking.instructorName}</p>
                          <p className="text-[10px] text-slate-400 transition-colors">{booking.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">${booking.price}.00</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          booking.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-full flex items-center justify-center text-3xl transition-colors">
                    <i className="fas fa-folder-open"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">No Past Lessons Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs transition-colors">Your completed and cancelled lessons will appear here as you progress through your training.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-between items-center transition-colors">
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors italic">Total Sessions Logged: {pastBookings.filter(b => b.status === 'COMPLETED').length}</p>
               <button 
                onClick={() => setShowHistoryModal(false)}
                className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InstructorDashboard = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="fa-dollar-sign" color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/20" label="Weekly Income" value="$1,450.00" />
        <StatCard icon="fa-user-graduate" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" label="Total Students" value="24 Active" />
        <StatCard icon="fa-star" color="text-yellow-500" bg="bg-yellow-50 dark:bg-yellow-900/20" label="Rating" value="4.9 / 5" />
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 p-6 transition-colors">
        <h3 className="font-bold mb-6 dark:text-white transition-colors">Today's Schedule</h3>
        <div className="space-y-4">
          {[
            { time: "09:00 AM", student: "Sarah Jenkins", type: "First Lesson", location: "Bondi Junction" },
            { time: "11:30 AM", student: "Mike Ross", type: "Mock Test", location: "Randwick" }
          ].map((lesson, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-12 text-center">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors">{lesson.time.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold transition-colors">{lesson.time.split(' ')[1]}</p>
                </div>
                <div className="border-l dark:border-slate-700 pl-4 transition-colors">
                  <h4 className="font-semibold text-slate-800 dark:text-white transition-colors">{lesson.student}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{lesson.type} • {lesson.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, color, bg, label, value }: { icon: string; color: string; bg: string; label: string; value: string }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-6 flex items-center space-x-5 hover:shadow-md transition-all">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-xl transition-colors`}>
      <i className={`fas ${icon} ${color}`}></i>
    </div>
    <div>
      <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors">{label}</p>
      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">{value}</p>
    </div>
  </div>
);

export default DashboardHome;
