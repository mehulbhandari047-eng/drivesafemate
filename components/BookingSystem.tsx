
import React, { useState, useEffect } from 'react';
import { Instructor, Booking, User } from '../types';
import { dbService } from '../services/databaseService';
import { emailService } from '../services/emailService';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingSystemProps {
  student: User;
  onBack: () => void;
  onBookingComplete: (booking: Booking) => void;
  preSelectedInstructor?: Instructor | null;
}

const TIME_SLOTS = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

const BookingSystem: React.FC<BookingSystemProps> = ({ student, onBack, onBookingComplete, preSelectedInstructor }) => {
  const [step, setStep] = useState<'SCHEDULE' | 'SEARCH' | 'CHECKOUT' | 'SUCCESS'>('SCHEDULE');
  const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(preSelectedInstructor || null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rollingDays, setRollingDays] = useState<{date: string, day: string, display: string}[]>([]);
  
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

  const fetchAvailabilityOrProceed = async () => {
    if (selectedInstructor) {
      setStep('CHECKOUT');
      return;
    }
    setIsLoading(true);
    const data = await dbService.getAvailableInstructors(selectedDate, selectedTime);
    setAvailableInstructors(data);
    setIsLoading(false);
    setStep('SEARCH');
  };

  const handleBookInstructor = (inst: Instructor) => {
    setSelectedInstructor(inst);
    setStep('CHECKOUT');
    setDetailInstructor(null);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    
    const newBooking = await dbService.createBooking({
      studentId: student.id,
      studentName: student.name,
      instructorId: selectedInstructor!.id,
      instructorName: selectedInstructor!.name,
      dateTime: `${selectedDate} ${selectedTime}`,
      status: 'CONFIRMED',
      duration: 60,
      location: 'Pickup at Residence',
      price: selectedInstructor!.pricePerHour
    });

    // Trigger the confirmation email notification
    emailService.sendConfirmationEmail(student.email, newBooking);
    
    setStep('SUCCESS');
    setTimeout(() => onBookingComplete(newBooking), 2500);
  };

  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center animate-slideUp">
        <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-4xl mb-10 shadow-xl shadow-emerald-500/20">
          <i className="fas fa-check"></i>
        </div>
        <h2 className="text-5xl font-black mb-4 tracking-tighter dark:text-white">Lesson Reserved.</h2>
        <p className="text-slate-500 text-xl font-medium">Prepare your learner permit. We'll see you on the road.</p>
        <button onClick={onBack} className="mt-12 px-10 py-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black shadow-lg">View Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-20 py-24 min-h-screen">
      <AnimatePresence mode="wait">
        {step === 'SCHEDULE' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter dark:text-white">Choose your time.</h2>
              {selectedInstructor && (
                <div className="flex items-center justify-center space-x-3 text-slate-500 font-bold">
                   <span>Booking with</span>
                   <img src={selectedInstructor.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                   <span className="text-slate-900 dark:text-white underline decoration-amber-400 decoration-2">{selectedInstructor.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide justify-center">
               {rollingDays.map(d => (
                 <button 
                  key={d.date} 
                  onClick={() => setSelectedDate(d.date)}
                  className={`p-6 rounded-[2rem] border-2 flex flex-col items-center min-w-[120px] transition-all ${selectedDate === d.date ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 hover:border-slate-300 dark:border-slate-800'}`}
                 >
                   <span className="text-[10px] font-black uppercase mb-1 opacity-60 tracking-widest">{d.day}</span>
                   <span className="text-2xl font-black">{d.display.split(' ')[0]}</span>
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
               {TIME_SLOTS.map(t => (
                 <button 
                  key={t} 
                  onClick={() => setSelectedTime(t)}
                  className={`py-8 rounded-3xl border-2 font-black text-xl transition-all ${selectedTime === t ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}
                 >
                   {t}
                 </button>
               ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
               <button onClick={onBack} className="px-10 py-6 border border-slate-200 dark:border-slate-800 rounded-3xl font-black text-xl hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900">Cancel</button>
               <button 
                 onClick={fetchAvailabilityOrProceed}
                 disabled={!selectedDate || !selectedTime || isLoading}
                 className="flex-1 max-w-2xl py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-2xl hover:opacity-90 shadow-2xl transition-all disabled:opacity-50"
               >
                 {isLoading ? <i className="fas fa-spinner animate-spin"></i> : 'Confirm Timing'}
               </button>
            </div>
          </motion.div>
        )}

        {step === 'SEARCH' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 animate-slideUp">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-black dark:text-white tracking-tighter">Available Supercoaches</h2>
               <button onClick={() => setStep('SCHEDULE')} className="text-sm font-black underline dark:text-white">Edit timing</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
              {availableInstructors.map(inst => (
                <div key={inst.id} className="cursor-pointer group" onClick={() => handleBookInstructor(inst)}>
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-5 relative shadow-sm border border-slate-100 dark:border-slate-800">
                    <img src={inst.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={inst.name} />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-premium tracking-widest text-slate-900">Verified Coach</div>
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h4 className="font-black text-xl text-slate-900 dark:text-white group-hover:underline">{inst.name}</h4>
                      <p className="text-slate-500 font-medium text-sm">{inst.transmission} Specialist • {inst.suburbs[0]}</p>
                      <p className="text-lg font-black mt-2 dark:text-white">${inst.pricePerHour} <span className="font-medium text-slate-400">/ hr</span></p>
                    </div>
                    <div className="flex items-center space-x-1 font-bold text-sm dark:text-white">
                       <i className="fas fa-star text-[10px] text-amber-400"></i>
                       <span>{inst.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'CHECKOUT' && selectedInstructor && (
          <motion.div key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
             <div className="flex flex-col lg:flex-row gap-20">
                <div className="flex-1 space-y-16">
                   <div>
                      <button onClick={() => setStep(preSelectedInstructor ? 'SCHEDULE' : 'SEARCH')} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-12 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800 transition-all"><i className="fas fa-chevron-left text-sm"></i></button>
                      <h2 className="text-5xl font-black tracking-tighter mb-12 dark:text-white">Confirm and pay</h2>
                      
                      <div className="space-y-10">
                         <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-10">
                            <div className="space-y-1">
                               <p className="font-black text-lg dark:text-white">Your session</p>
                               <p className="text-slate-500 font-medium">{selectedDate} at {selectedTime}</p>
                            </div>
                            <button onClick={() => setStep('SCHEDULE')} className="text-sm font-black underline hover:text-slate-500 transition-colors dark:text-white">Edit</button>
                         </div>
                         <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-10">
                            <div className="space-y-1">
                               <p className="font-black text-lg dark:text-white">Payment Method</p>
                               <p className="text-slate-500 font-medium flex items-center"><i className="fab fa-cc-visa mr-2 text-xl"></i> Visa ending in 4242</p>
                            </div>
                            <button className="text-sm font-black underline hover:text-slate-500 transition-colors dark:text-white">Change</button>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[2.5rem] space-y-4">
                      <p className="font-black text-lg dark:text-white">Cancellation policy</p>
                      <p className="text-slate-500 leading-relaxed font-medium">Free cancellation for 48 hours. After that, cancel up to 24 hours before your experience starts for a partial refund.</p>
                   </div>

                   <button onClick={handlePayment} disabled={isProcessing} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-2xl shadow-floating hover:opacity-90 active:scale-95 transition-all">
                      {isProcessing ? <><i className="fas fa-spinner animate-spin mr-3"></i><span>Processing...</span></> : 'Confirm Reservation'}
                   </button>
                </div>

                <div className="w-full lg:w-[450px]">
                   <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-premium sticky top-32">
                      <div className="flex items-center space-x-6 pb-10 border-b border-slate-100 dark:border-slate-800 mb-10">
                         <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm">
                            <img src={selectedInstructor.avatar} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Coach Experience</p>
                            <h4 className="font-black text-2xl tracking-tighter dark:text-white leading-tight">{selectedInstructor.name}</h4>
                            <p className="text-sm text-slate-500 font-medium mt-1">{selectedInstructor.transmission} Specialist • {selectedInstructor.rating} Stars</p>
                         </div>
                      </div>

                      <div className="space-y-6 mb-10">
                         <h3 className="text-2xl font-black dark:text-white tracking-tight">Price Summary</h3>
                         <div className="flex justify-between text-lg text-slate-600 dark:text-slate-400 font-medium">
                            <span>1x Professional Lesson</span>
                            <span>${selectedInstructor.pricePerHour}.00</span>
                         </div>
                         <div className="flex justify-between text-lg text-slate-600 dark:text-slate-400 font-medium">
                            <span>DeepDrive Service Fee</span>
                            <span>$0.00</span>
                         </div>
                      </div>

                      <div className="flex justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                         <span className="font-black text-2xl dark:text-white">Total <span className="text-slate-400 text-sm font-medium ml-1">(AUD)</span></span>
                         <span className="font-black text-3xl dark:text-white">${selectedInstructor.pricePerHour}.00</span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingSystem;
