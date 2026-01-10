
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

const TIME_SLOTS = ['08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

const BookingSystem: React.FC<BookingSystemProps> = ({ student, onBack, onBookingComplete }) => {
  const [step, setStep] = useState<'SCHEDULE' | 'SEARCH' | 'CHECKOUT' | 'SUCCESS'>('SCHEDULE');
  const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [rollingDays, setRollingDays] = useState<{date: string, day: string, display: string}[]>([]);
  
  // Booking Type & Confirmation State
  const [bookingType, setBookingType] = useState<'STANDARD' | 'TRIAL'>('STANDARD');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Instructor Detail States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailInstructor, setDetailInstructor] = useState<Instructor | null>(null);
  const [instructorReviews, setInstructorReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Payment States
  const [cardName, setCardName] = useState(student.name);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

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

  const openInstructorDetail = async (inst: Instructor) => {
    setDetailInstructor(inst);
    setShowDetailModal(true);
    setIsLoadingReviews(true);
    const reviews = await dbService.getInstructorReviews(inst.id);
    setInstructorReviews(reviews);
    setIsLoadingReviews(false);
  };

  const initiateBookingFlow = (inst: Instructor, type: 'STANDARD' | 'TRIAL') => {
    setSelectedInstructor(inst);
    setBookingType(type);
    setShowDetailModal(false);
    setAgreedToTerms(false); // Reset terms agreement
    setShowConfirmModal(true);
  };

  const confirmAndProceed = () => {
    if (!agreedToTerms) return;
    setShowConfirmModal(false);
    setStep('CHECKOUT');
  };

  const filteredInstructors = useMemo(() => {
    return availableInstructors.filter(inst => {
      const matchesSearch = inst.suburbs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) || 
                            inst.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTransmission = transmissionFilter === 'All' || inst.transmission === transmissionFilter || inst.transmission === 'Both';
      return matchesSearch && matchesTransmission;
    });
  }, [availableInstructors, searchQuery, transmissionFilter]);

  // Derived Values for Trial vs Standard
  const bookingDuration = bookingType === 'TRIAL' ? 30 : 60;
  const bookingPrice = useMemo(() => {
    if (!selectedInstructor) return 0;
    return bookingType === 'TRIAL' 
      ? Math.floor(selectedInstructor.pricePerHour * 0.6) // Trial is roughly 60% of hourly rate for 30 mins
      : selectedInstructor.pricePerHour;
  }, [selectedInstructor, bookingType]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstructor) return;
    
    setIsProcessing(true);
    setPaymentError(null);
    
    // 1. Process with Payment Gateway
    const result = await paymentService.processTransaction(bookingPrice, {
      name: cardName,
      number: cardNumber,
      expiry,
      cvv
    });

    if (!result.success) {
      setPaymentError(result.error || "Transaction failed.");
      setIsProcessing(false);
      return;
    }
    
    // 2. Persist Booking on Gateway Success
    try {
      const newBooking = await dbService.createBooking({
        studentId: student.id,
        studentName: student.name,
        instructorId: selectedInstructor.id,
        instructorName: selectedInstructor.name,
        dateTime: `${selectedDate} ${selectedTime}`,
        status: 'CONFIRMED',
        duration: bookingDuration,
        location: 'Student Home Pickup',
        price: bookingPrice
      });
      
      // 3. Send Notifications
      emailService.sendConfirmationEmail(student.email, newBooking);
      setStep('SUCCESS');
      
      // Success auto-exit after 3 seconds
      setTimeout(() => onBookingComplete(newBooking), 3500);
    } catch (error) {
      setPaymentError("Payment was successful but booking registration failed. Please contact support with ID: " + result.transactionId);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'SUCCESS') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-8">
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
            <i className="fas fa-check"></i>
          </motion.div>
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-emerald-500 rounded-full -z-10"></motion.div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md font-medium">Your {bookingType === 'TRIAL' ? 'Trial' : 'Standard'} lesson with {selectedInstructor?.name} is confirmed. A receipt has been sent to your email.</p>
        <div className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 inline-block text-left mb-8">
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Secure Booking ID</p>
            <p className="text-sm font-black dark:text-white text-emerald-700 dark:text-emerald-300">#DSM-{Math.floor(Math.random()*90000) + 10000}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border dark:border-slate-800 transition-colors sticky top-20 z-40">
        <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2 font-bold px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
          <i className="fas fa-arrow-left"></i>
          <span>Cancel</span>
        </button>
        <div className="flex items-center space-x-6 text-xs font-black uppercase tracking-widest">
          <div className={`flex items-center space-x-2 ${['SCHEDULE', 'SEARCH', 'CHECKOUT'].includes(step) ? 'text-amber-500' : 'text-slate-300'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-[10px] text-white">1</span>
            <span className="hidden sm:inline">Time</span>
          </div>
          <div className={`flex items-center space-x-2 ${['SEARCH', 'CHECKOUT'].includes(step) ? 'text-amber-500' : 'text-slate-300'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-[10px] text-white">2</span>
            <span className="hidden sm:inline">Instructor</span>
          </div>
          <div className={`flex items-center space-x-2 ${['CHECKOUT'].includes(step) ? 'text-amber-500' : 'text-slate-300'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-[10px] text-white">3</span>
            <span className="hidden sm:inline">Secure Pay</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'SCHEDULE' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="text-center py-10">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3">When do you want to drive?</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Availability is calculated in real-time based on your selection.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl transition-colors">
                <div className="space-y-10">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">1. Select Date</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                            {rollingDays.map(day => (
                                <button
                                    key={day.date}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                                        selectedDate === day.date 
                                        ? 'bg-amber-400 border-amber-400 text-slate-900 shadow-lg shadow-amber-900/10 scale-105' 
                                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase mb-1">{day.day}</span>
                                    <span className="text-xl font-black">{day.display.split(' ')[0]}</span>
                                    <span className="text-[10px] font-bold uppercase">{day.display.split(' ')[1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">2. Select Time</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {TIME_SLOTS.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-4 rounded-xl font-bold text-sm transition-all border-2 ${
                                        selectedTime === time 
                                        ? 'bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 border-slate-900 dark:border-amber-400 shadow-lg scale-105' 
                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t dark:border-slate-800 flex justify-end">
                        <button
                            disabled={!selectedDate || !selectedTime || isLoading}
                            onClick={fetchAvailability}
                            className="bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-amber-500 transition-all flex items-center space-x-3"
                        >
                            {isLoading ? (
                                <><i className="fas fa-circle-notch animate-spin"></i><span>Checking Schedules...</span></>
                            ) : (
                                <><i className="fas fa-search"></i><span>See Available Experts</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        {step === 'SEARCH' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Confirmed Matches</h2>
                    <p className="text-slate-500 font-medium">Experts available for <span className="text-amber-500 font-bold">{selectedDate} @ {selectedTime}</span></p>
                </div>
                <div className="flex space-x-4">
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Suburb or Name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 focus:ring-4 focus:ring-amber-500/10 outline-none w-full md:w-64 transition-all"
                        />
                    </div>
                    <select 
                        value={transmissionFilter}
                        onChange={(e) => setTransmissionFilter(e.target.value)}
                        className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 outline-none font-bold text-sm"
                    >
                        <option value="All">All Gears</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInstructors.length > 0 ? filteredInstructors.map((inst) => (
                <motion.div 
                  key={inst.id} 
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                  }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 overflow-hidden group shadow-sm transition-all"
                >
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => openInstructorDetail(inst)}>
                    <img src={inst.avatar} alt={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-black text-slate-900 shadow-xl border border-white/20">
                      ${inst.pricePerHour}<span className="text-[10px] text-slate-500 ml-1">AUD/HR</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center space-x-2 border border-white/10">
                        <div className="flex items-center text-amber-400 font-black text-xs">
                          <i className="fas fa-star mr-1"></i>
                          <span>{inst.rating}</span>
                        </div>
                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{inst.reviewCount} Reviews</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black dark:text-white leading-none cursor-pointer hover:text-amber-500 transition-colors" onClick={() => openInstructorDetail(inst)}>{inst.name}</h3>
                      <button 
                        onClick={() => openInstructorDetail(inst)}
                        className="text-slate-400 hover:text-amber-500 transition-colors"
                      >
                        <i className="fas fa-info-circle text-lg"></i>
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">{inst.bio}</p>
                    <button 
                      onClick={() => initiateBookingFlow(inst, 'STANDARD')}
                      className="w-full py-4 bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 font-black rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-amber-300 transition-all"
                    >
                      Book Session
                    </button>
                  </div>
                </motion.div>
              )) : (
                  <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem]">
                    <i className="fas fa-search text-4xl text-slate-300 mb-4"></i>
                    <p className="text-slate-500 font-medium">No instructors found matching your criteria.</p>
                  </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'CHECKOUT' && selectedInstructor && (
           <motion.div key="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Summary Side */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Lesson Details</h3>
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${bookingType === 'TRIAL' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                             {bookingType === 'TRIAL' ? 'Trial Session' : 'Standard Session'}
                           </span>
                        </div>
                        <div className="flex items-center space-x-6 mb-10">
                            <img src={selectedInstructor.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                            <div>
                                <p className="text-xl font-black dark:text-white">{selectedInstructor.name}</p>
                                <p className="text-xs font-bold text-amber-500">{selectedInstructor.transmission} Lesson</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-400">Date</span>
                                <span className="dark:text-white">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-400">Time</span>
                                <span className="dark:text-white">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-400">Duration</span>
                                <span className="dark:text-white">{bookingDuration} Minutes</span>
                            </div>
                        </div>

                        <div className="border-t pt-6 flex justify-between items-center">
                            <span className="text-xl font-black dark:text-white">Amount Due</span>
                            <span className="text-3xl font-black text-amber-500">${bookingPrice}.00</span>
                        </div>
                    </div>
                    
                    {paymentError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center space-x-3">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>{paymentError}</span>
                      </div>
                    )}
                </div>

                {/* Payment Side */}
                <div>
                    <div className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative text-white">
                        <h2 className="text-2xl font-black mb-10 flex items-center space-x-3 text-amber-400">
                            <i className="fas fa-lock"></i>
                            <span>Secure Checkout</span>
                        </h2>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cardholder Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-400 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Number</label>
                                <input 
                                    required
                                    type="text" 
                                    maxLength={19}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-400 font-bold tracking-widest"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</label>
                                    <input required type="text" maxLength={5} placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CVV</label>
                                    <input required type="password" maxLength={3} placeholder="***" value={cvv} onChange={(e) => setCvv(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none" />
                                </div>
                            </div>

                            <button 
                                disabled={isProcessing}
                                type="submit"
                                className="w-full py-5 bg-amber-400 text-slate-900 font-black rounded-2xl shadow-xl hover:bg-amber-500 transition-all flex items-center justify-center space-x-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Authorising...</span>
                                    </>
                                ) : (
                                    <span>Pay ${bookingPrice}.00</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedInstructor && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl p-10 border dark:border-slate-800"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Review Your Booking</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Please confirm these details are correct before we process your payment.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl space-y-4 mb-8 border dark:border-slate-700">
                <div className="flex items-center space-x-4 pb-4 border-b dark:border-slate-700">
                  <img src={selectedInstructor.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">{selectedInstructor.name}</p>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{bookingType} SESSION</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                    <p className="text-sm font-bold dark:text-white">{selectedDate}</p>
                    <p className="text-sm font-bold dark:text-white">{selectedTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-bold dark:text-white">{bookingDuration} Minutes</p>
                  </div>
                </div>
                <div className="pt-4 border-t dark:border-slate-700 flex justify-between items-center">
                  <span className="text-lg font-black dark:text-white">Total Amount</span>
                  <span className="text-2xl font-black text-amber-500">${bookingPrice}.00</span>
                </div>
              </div>

              {/* Final Confirmation Terms */}
              <div className="mb-10 px-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer" 
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    I confirm that the booking details are correct and I agree to the <span className="font-bold text-amber-600 underline">24-hour cancellation policy</span>.
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowConfirmModal(false)} 
                  className="py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Go Back
                </button>
                <button 
                  disabled={!agreedToTerms}
                  onClick={confirmAndProceed} 
                  className="py-4 bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 font-black rounded-2xl shadow-xl shadow-amber-900/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Confirm & Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instructor Detail Modal */}
      <AnimatePresence>
        {showDetailModal && detailInstructor && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh]"
             >
                {/* Left Side: Profile & Ratings */}
                <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800 p-10 border-r dark:border-slate-700 flex flex-col items-center">
                   <img src={detailInstructor.avatar} className="w-32 h-32 rounded-3xl object-cover shadow-xl mb-6 border-4 border-white dark:border-slate-700" alt="" />
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-1">{detailInstructor.name}</h2>
                   <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-8">{detailInstructor.transmission} Specialist</p>
                   
                   <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-4xl font-black text-slate-900 dark:text-white">{detailInstructor.rating}</span>
                         <div className="text-right">
                            <div className="flex text-amber-400 text-xs">
                               {[1,2,3,4,5].map(i => <i key={i} className={`fas fa-star ${i <= Math.round(detailInstructor.rating) ? '' : 'opacity-20'}`}></i>)}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{detailInstructor.reviewCount} total reviews</p>
                         </div>
                      </div>
                      
                      {/* Rating Progress Bars */}
                      <div className="space-y-2">
                         {[5,4,3,2,1].map(star => (
                            <div key={star} className="flex items-center space-x-3">
                               <span className="text-[10px] font-bold text-slate-400 w-4">{star}</span>
                               <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${star === 5 ? '85%' : star === 4 ? '12%' : '3%'}` }}
                                    className="h-full bg-amber-400"
                                  />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="w-full space-y-3 mt-10">
                      <button 
                        onClick={() => initiateBookingFlow(detailInstructor, 'TRIAL')}
                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 hover:scale-105 transition-all flex flex-col items-center justify-center"
                      >
                        <span className="text-sm">Book Trial Lesson</span>
                        <span className="text-[9px] opacity-80 uppercase tracking-widest">30 Mins • ${Math.floor(detailInstructor.pricePerHour * 0.6)} AUD</span>
                      </button>

                      <button 
                        onClick={() => initiateBookingFlow(detailInstructor, 'STANDARD')}
                        className="w-full py-4 bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex flex-col items-center justify-center"
                      >
                        <span className="text-sm">Standard Session</span>
                        <span className="text-[9px] opacity-80 uppercase tracking-widest">60 Mins • ${detailInstructor.pricePerHour} AUD</span>
                      </button>
                   </div>
                </div>

                {/* Right Side: Bio & Reviews */}
                <div className="flex-1 overflow-y-auto p-10 bg-white dark:bg-slate-900 scrollbar-hide">
                   <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Instructor Bio</h3>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{detailInstructor.bio} Skilled in navigating {detailInstructor.suburbs.join(', ')}.</p>
                      </div>
                      <button onClick={() => setShowDetailModal(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
                        <i className="fas fa-times text-xl"></i>
                      </button>
                   </div>

                   <div className="space-y-8">
                      <div>
                         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Student Feedback</h3>
                         {isLoadingReviews ? (
                           <div className="space-y-4">
                              {[1,2].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>)}
                           </div>
                         ) : instructorReviews.length > 0 ? (
                           <div className="space-y-6">
                              {instructorReviews.map(rev => (
                                <div key={rev.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border dark:border-slate-700">
                                   <div className="flex justify-between items-start mb-3">
                                      <div>
                                         <p className="font-bold text-slate-900 dark:text-white">{rev.studentName}</p>
                                         <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(rev.date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>
                                      </div>
                                      <div className="flex text-amber-400 text-[10px]">
                                         {[1,2,3,4,5].map(i => <i key={i} className={`fas fa-star ${i <= rev.rating ? '' : 'opacity-20'}`}></i>)}
                                      </div>
                                   </div>
                                   <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{rev.comment}"</p>
                                </div>
                              ))}
                           </div>
                         ) : (
                           <p className="text-sm text-slate-400 italic">No reviews yet for this instructor.</p>
                         )}
                      </div>

                      <div className="pt-8 border-t dark:border-slate-800">
                         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Qualifications</h3>
                         <div className="flex flex-wrap gap-2">
                            {detailInstructor.specialties.map(spec => (
                               <span key={spec} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-wider">{spec}</span>
                            ))}
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-wider">Dual Control Car</span>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingSystem;
