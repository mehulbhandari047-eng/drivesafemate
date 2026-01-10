
import React, { useState, useEffect, useMemo } from 'react';
import { Instructor, Booking, UserRole, User, Review } from '../types';
import { dbService } from '../services/databaseService';
import { emailService } from '../services/emailService';
import { paymentService } from '../services/paymentService';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingSystemProps {
  student: User;
  onBack: () => void;
  onBookingComplete: (booking: Booking) => void;
}

const TIME_SLOTS = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

const BookingSystem: React.FC<BookingSystemProps> = ({ student, onBack, onBookingComplete }) => {
  const [step, setStep] = useState<'SCHEDULE' | 'SEARCH' | 'CHECKOUT' | 'SUCCESS'>('SCHEDULE');
  const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rollingDays, setRollingDays] = useState<{date: string, day: string, display: string}[]>([]);
  
  const [bookingType, setBookingType] = useState<'STANDARD' | 'TRIAL'>('STANDARD');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailInstructor, setDetailInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        date: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('en-AU', { weekday: 'short' }),
        display: d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
      });
    }
    setRollingDays(days);
    if (days.length > 0) setSelectedDate(days[0].date);
  }, []);

  const fetchAvailability = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsLoading(true);
    const data = await dbService.getAvailableInstructors(selectedDate, selectedTime);
    setAvailableInstructors(data);
    setIsLoading(false);
    setStep('SEARCH');
  };

  const handleBookInstructor = (inst: Instructor, type: 'STANDARD' | 'TRIAL') => {
    setSelectedInstructor(inst);
    setBookingType(type);
    setStep('CHECKOUT');
    setShowDetailModal(false);
  };

  const filteredInstructors = useMemo(() => {
    return availableInstructors.filter(inst => {
      const matchesSearch = inst.suburbs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) || 
                            inst.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTransmission = transmissionFilter === 'All' || inst.transmission === transmissionFilter || inst.transmission === 'Both';
      return matchesSearch && matchesTransmission;
    });
  }, [availableInstructors, searchQuery, transmissionFilter]);

  const bookingPrice = useMemo(() => {
    if (!selectedInstructor) return 0;
    return bookingType === 'TRIAL' ? Math.floor(selectedInstructor.pricePerHour * 0.6) : selectedInstructor.pricePerHour;
  }, [selectedInstructor, bookingType]);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate gateway
    const newBooking = await dbService.createBooking({
      studentId: student.id,
      studentName: student.name,
      instructorId: selectedInstructor!.id,
      instructorName: selectedInstructor!.name,
      dateTime: `${selectedDate} ${selectedTime}`,
      status: 'CONFIRMED',
      duration: bookingType === 'TRIAL' ? 30 : 60,
      location: 'Pickup at Residence',
      price: bookingPrice
    });
    setStep('SUCCESS');
    setTimeout(() => onBookingComplete(newBooking), 3000);
  };

  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-emerald-500/30">
          <i className="fas fa-check"></i>
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">You're All Set!</h2>
        <p className="text-slate-500 font-medium">Safe driving! Your coach has been notified.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Progress Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-6 rounded-[2.5rem] border dark:border-slate-800 shadow-sm flex items-center justify-between sticky top-24 z-40 transition-all">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
          <i className="fas fa-chevron-left"></i>
          <span>Exit</span>
        </button>
        <div className="flex items-center space-x-12">
           <StepIndicator num={1} label="Slot" active={step === 'SCHEDULE'} done={step !== 'SCHEDULE'} />
           <StepIndicator num={2} label="Expert" active={step === 'SEARCH'} done={step === 'CHECKOUT'} />
           <StepIndicator num={3} label="Payment" active={step === 'CHECKOUT'} done={false} />
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <AnimatePresence mode="wait">
        {step === 'SCHEDULE' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
            <div className="text-center">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Pick Your Window.</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Select a date and time that fits your lifestyle.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border dark:border-slate-800 shadow-xl transition-colors">
                <div className="space-y-12">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Calendar Selection</h3>
                        <div className="flex space-x-5 overflow-x-auto pb-6 scrollbar-hide">
                            {rollingDays.map(day => (
                                <button
                                    key={day.date}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`flex-shrink-0 w-24 h-32 rounded-3xl flex flex-col items-center justify-center transition-all border-2 ${
                                        selectedDate === day.date 
                                        ? 'bg-amber-400 border-amber-400 text-slate-900 shadow-2xl shadow-amber-400/20 scale-105' 
                                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase mb-2 tracking-tighter opacity-60">{day.day}</span>
                                    <span className="text-3xl font-black mb-1">{day.display.split(' ')[0]}</span>
                                    <span className="text-[10px] font-black uppercase opacity-60">{day.display.split(' ')[1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Time Preference</h3>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            {TIME_SLOTS.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-5 rounded-2xl font-black text-sm transition-all border-2 ${
                                        selectedTime === time 
                                        ? 'bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 border-slate-900 shadow-xl scale-105' 
                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10 flex justify-center">
                        <button
                            disabled={!selectedDate || !selectedTime || isLoading}
                            onClick={fetchAvailability}
                            className="bg-amber-400 disabled:opacity-50 text-slate-900 px-12 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-amber-400/20 hover:scale-105 transition-all flex items-center space-x-4"
                        >
                            {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magnifying-glass"></i>}
                            <span>Verify Availability</span>
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        {step === 'SEARCH' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Select your Coach</h2>
                    <p className="text-slate-500 font-medium">Matches for <span className="text-amber-500 font-black">{selectedDate} at {selectedTime}</span></p>
                </div>
                <div className="flex gap-4">
                    <div className="relative flex-1 lg:w-80">
                        <i className="fas fa-map-pin absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search location..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredInstructors.length > 0 ? filteredInstructors.map((inst) => (
                <motion.div 
                  key={inst.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 overflow-hidden shadow-sm group hover:shadow-2xl transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={inst.avatar} className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 right-6 bg-slate-900/90 text-amber-400 px-5 py-2.5 rounded-2xl text-xs font-black shadow-2xl border border-white/10">
                      ${inst.pricePerHour}<span className="text-[8px] opacity-60 ml-1 tracking-widest uppercase">/HR</span>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-2xl font-black dark:text-white leading-none">{inst.name}</h3>
                       <div className="flex items-center text-amber-500 text-sm font-black space-x-1">
                          <i className="fas fa-star"></i>
                          <span>{inst.rating}</span>
                       </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-2 leading-relaxed">{inst.bio}</p>
                    <div className="flex gap-3">
                       <button onClick={() => {setDetailInstructor(inst); setShowDetailModal(true);}} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Details</button>
                       <button onClick={() => handleBookInstructor(inst, 'STANDARD')} className="flex-[2] py-4 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-400/10 transition-all hover:scale-105 active:scale-95">Book Now</button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                  <div className="col-span-full text-center py-32 bg-slate-50 dark:bg-slate-800 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <i className="fas fa-face-frown text-6xl text-slate-300 mb-6"></i>
                    <p className="text-slate-500 font-black text-xl">No coaches found in this area.</p>
                  </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'CHECKOUT' && selectedInstructor && (
           <motion.div key="checkout" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
             <div className="bg-white dark:bg-slate-900 rounded-[4rem] border dark:border-slate-800 p-12 lg:p-16 shadow-2xl overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Reservation Summary</h3>
                        <div className="flex items-center space-x-6 mb-10">
                            <img src={selectedInstructor.avatar} className="w-20 h-20 rounded-3xl object-cover shadow-xl" alt="" />
                            <div>
                                <p className="text-2xl font-black dark:text-white leading-tight">{selectedInstructor.name}</p>
                                <p className="text-xs font-black text-amber-500 uppercase tracking-widest">{selectedInstructor.transmission} Mastery</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <SummaryLine label="Appointment" value={`${selectedDate} @ ${selectedTime}`} />
                            <SummaryLine label="Service Type" value={bookingType === 'TRIAL' ? 'Trial Session (30m)' : 'Standard Lesson (60m)'} />
                            <SummaryLine label="Address" value="Pickup from Home" />
                        </div>

                        <div className="pt-8 border-t dark:border-slate-800">
                           <div className="flex justify-between items-center">
                              <span className="text-xl font-black dark:text-white">Total Charge</span>
                              <span className="text-4xl font-black text-amber-500 tracking-tighter">${bookingPrice}.00</span>
                           </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[3rem] border dark:border-slate-700/50">
                        <h4 className="text-lg font-black dark:text-white mb-8">Secure Checkout</h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Card Details</label>
                                <div className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl flex items-center space-x-4 text-slate-400 italic text-sm">
                                   <i className="fas fa-credit-card"></i>
                                   <span>Payment handled by Stripe</span>
                                </div>
                            </div>
                            <button 
                                onClick={handlePayment} 
                                disabled={isProcessing}
                                className="w-full py-5 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                            >
                                {isProcessing ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-lock"></i>}
                                <span>{isProcessing ? 'Verifying...' : 'Pay & Confirm'}</span>
                            </button>
                            <p className="text-[10px] text-center text-slate-400 font-medium">Encrypted with 256-bit SSL security.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 translate-y-1/2 translate-x-1/2"></div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal Enhanced */}
      <AnimatePresence>
        {showDetailModal && detailInstructor && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
                <div className="w-full md:w-2/5 bg-slate-50 dark:bg-slate-800 p-12 flex flex-col items-center">
                    <img src={detailInstructor.avatar} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl mb-8 border-4 border-white dark:border-slate-700" alt="" />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-2">{detailInstructor.name}</h2>
                    <p className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-12">Certified Coach</p>
                    
                    <div className="w-full space-y-4">
                       <button onClick={() => handleBookInstructor(detailInstructor, 'TRIAL')} className="w-full py-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border dark:border-slate-600 rounded-2xl font-black text-sm transition-all hover:bg-slate-50 flex justify-between px-8 items-center">
                          <span>30m Intro Session</span>
                          <span className="text-amber-500">${Math.floor(detailInstructor.pricePerHour * 0.6)}</span>
                       </button>
                       <button onClick={() => handleBookInstructor(detailInstructor, 'STANDARD')} className="w-full py-5 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-900 rounded-2xl font-black text-sm transition-all shadow-xl flex justify-between px-8 items-center">
                          <span>60m Full Lesson</span>
                          <span className="font-black">${detailInstructor.pricePerHour}</span>
                       </button>
                    </div>
                </div>
                <div className="flex-1 p-12 overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-start mb-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coaching Philosophy</h3>
                        <button onClick={() => setShowDetailModal(false)} className="text-slate-300 hover:text-slate-500"><i className="fas fa-times text-xl"></i></button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-lg mb-12">{detailInstructor.bio}</p>
                    
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Service Areas</h3>
                    <div className="flex flex-wrap gap-2 mb-12">
                       {detailInstructor.suburbs.map(s => <span key={s} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black dark:text-white">{s}</span>)}
                    </div>

                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Instructor Qualifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {detailInstructor.specialties.map(spec => (
                         <div key={spec} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase">
                            <i className="fas fa-certificate"></i>
                            <span>{spec}</span>
                         </div>
                       ))}
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StepIndicator = ({ num, label, active, done }: any) => (
  <div className={`flex items-center space-x-3 transition-all ${active ? 'scale-110' : 'opacity-40'}`}>
     <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${done ? 'bg-emerald-500 text-white' : active ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
        {done ? <i className="fas fa-check"></i> : num}
     </div>
     <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const SummaryLine = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-sm">
     <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{label}</span>
     <span className="font-black dark:text-white">{value}</span>
  </div>
);

export default BookingSystem;
