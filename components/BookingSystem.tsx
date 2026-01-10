
import React, { useState, useEffect } from 'react';
import { Instructor, Booking } from '../types';
import { emailService } from '../services/emailService';

interface BookingSystemProps {
  onBack: () => void;
  onBookingComplete: (booking: Booking) => void;
}

const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst_1',
    userId: 'u_1',
    name: 'David Thompson',
    avatar: 'https://i.pravatar.cc/150?u=david',
    specialties: ['Nervous Drivers', 'Test Prep', 'Motorway'],
    rating: 4.9,
    reviewCount: 128,
    pricePerHour: 75,
    suburbs: ['Bondi', 'Randwick', 'Coogee'],
    available: true,
    transmission: 'Automatic',
    carModel: '2023 Toyota Corolla Hybrid',
    languages: ['English'],
    bio: 'With 15 years of experience in NSW, I specialize in helping nervous learners find their confidence on the road.',
    isVerified: true
  },
  {
    id: 'inst_2',
    userId: 'u_2',
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    specialties: ['Intensive Courses', 'Manual Specialist'],
    rating: 5.0,
    reviewCount: 84,
    pricePerHour: 85,
    suburbs: ['Parramatta', 'Blacktown', 'Ryde'],
    available: true,
    transmission: 'Manual',
    carModel: '2024 Mazda 3',
    languages: ['English', 'Mandarin'],
    bio: 'Expert manual instructor. High pass rate for first-time test takers in the Western Suburbs.',
    isVerified: true
  },
  {
    id: 'inst_3',
    userId: 'u_3',
    name: 'Marcus Aurelius',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    specialties: ['Defensive Driving', 'International Conversions'],
    rating: 4.8,
    reviewCount: 210,
    pricePerHour: 70,
    suburbs: ['Sydney CBD', 'Surry Hills', 'Paddington'],
    available: true,
    transmission: 'Both',
    carModel: '2022 Volkswagen Golf',
    languages: ['English', 'Italian'],
    bio: 'Focused on safety and defensive driving techniques. I make sure you don\'t just pass the test, but stay safe for life.',
    isVerified: true
  }
];

const TIME_SLOTS = ['08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

const CancellationPolicyBox: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => (
  <div className={`${isOpen ? 'fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-6 transition-colors animate-fadeIn'}`}>
    <div className={`${isOpen ? 'bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8 animate-scaleIn' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="flex items-center text-sm font-bold text-blue-900 dark:text-blue-300">
          <i className="fas fa-clock-rotate-left mr-2"></i>
          DriveSafeMate Cancellation Policy
        </h4>
        {isOpen && onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs">
            <i className="fas fa-check"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Free Cancellation</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Cancel or reschedule at no cost up to <strong>24 hours</strong> before your lesson start time.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Late Cancellation Fee (50%)</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Cancellations within <strong>24 hours</strong> of the lesson incur a 50% fee to compensate our instructors' time.</p>
          </div>
        </div>
      </div>
      {isOpen && (
        <button onClick={onClose} className="w-full mt-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
          I Understand
        </button>
      )}
    </div>
  </div>
);

const BookingSystem: React.FC<BookingSystemProps> = ({ onBack, onBookingComplete }) => {
  const [step, setStep] = useState<'SEARCH' | 'PROFILE' | 'CHECKOUT' | 'SUCCESS'>('SEARCH');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingMode, setBookingMode] = useState<'STANDARD' | 'TRIAL'>('STANDARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [rollingDays, setRollingDays] = useState<{date: string, day: string, display: string}[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

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

  const filteredInstructors = MOCK_INSTRUCTORS.filter(inst => {
    const matchesSearch = inst.suburbs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          inst.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTransmission = transmissionFilter === 'All' || inst.transmission === transmissionFilter || inst.transmission === 'Both';
    return matchesSearch && matchesTransmission;
  });

  const handleSelectInstructor = (inst: Instructor) => {
    setSelectedInstructor(inst);
    setStep('PROFILE');
  };

  const handleConfirmBookingRequest = (mode: 'STANDARD' | 'TRIAL') => {
    if (selectedDate && selectedTime) {
      setBookingMode(mode);
      setStep('CHECKOUT');
    }
  };

  const getBookingDetails = () => {
    if (!selectedInstructor) return { price: 0, duration: 0, label: '' };
    if (bookingMode === 'TRIAL') {
      return { price: Math.round(selectedInstructor.pricePerHour * 0.6), duration: 45, label: 'Introductory Trial Lesson' };
    }
    return { price: selectedInstructor.pricePerHour, duration: 60, label: 'Standard Practical Lesson' };
  };

  const { price, duration, label } = getBookingDetails();

  const handlePayment = () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
      if (selectedInstructor) {
        const newBooking: Booking = {
          id: 'book_' + Math.random().toString(36).substr(2, 9),
          studentId: 'current_student',
          instructorId: selectedInstructor.id,
          instructorName: selectedInstructor.name,
          dateTime: `${selectedDate} ${selectedTime}`,
          status: 'CONFIRMED',
          duration: duration,
          location: 'Student Home Pickup',
          price: price
        };
        onBookingComplete(newBooking);
        emailService.sendConfirmationEmail('john.doe@example.com', newBooking);
      }
    }, 2000);
  };

  const handleShare = () => {
    if (!selectedInstructor) return;
    const url = `${window.location.origin}/instructor/${selectedInstructor.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const openSocial = (platform: 'twitter' | 'facebook') => {
    if (!selectedInstructor) return;
    const url = encodeURIComponent(`${window.location.origin}/instructor/${selectedInstructor.id}`);
    const text = encodeURIComponent(`I'm booking a driving lesson with ${selectedInstructor.name} on DriveSafeMate! 🚗💨`);
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Helper to simulate "Taken" slots for the visual calendar
  const isSlotTaken = (date: string, time: string) => {
    return (date.length + time.length) % 3 === 0;
  };

  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">
          <i className="fas fa-check"></i>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Booking Confirmed!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md transition-colors">Your lesson with {selectedInstructor?.name} is all set.</p>
        <button onClick={onBack} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      {showPolicyModal && <CancellationPolicyBox isOpen onClose={() => setShowPolicyModal(false)} />}
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scaleIn transition-colors">
            <div className="p-8 border-b dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Final Review</h3>
              <p className="text-xs text-slate-500 mt-1">Please confirm your booking details before proceeding.</p>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl transition-colors">
                <img src={selectedInstructor?.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instructor</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedInstructor?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedDate}</p>
                  <p className="text-xs text-slate-500">{selectedTime}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-xl font-black text-blue-600">${price}.00</p>
                  <p className="text-[10px] text-slate-500">AUD inc. GST</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                  <i className="fas fa-info-circle mr-1"></i>
                  By confirming, you agree to our 24-hour cancellation policy. A 50% late fee applies within 24 hours of start.
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex space-x-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold border dark:border-slate-600">Cancel</button>
              <button onClick={handlePayment} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border dark:border-slate-800 sticky top-20 z-20">
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2 font-medium">
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <button onClick={() => setShowPolicyModal(true)} className="hidden sm:flex items-center space-x-2 text-blue-600 text-xs font-bold hover:underline">
            <i className="fas fa-file-contract"></i>
            <span>Cancellation Policy</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <span className={step === 'SEARCH' ? 'text-blue-600 font-bold' : 'text-slate-400'}>Find</span>
          <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
          <span className={step === 'PROFILE' ? 'text-blue-600 font-bold' : 'text-slate-400'}>Schedule</span>
          <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
          <span className={step === 'CHECKOUT' ? 'text-blue-600 font-bold' : 'text-slate-400'}>Checkout</span>
        </div>
      </div>

      {step === 'SEARCH' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" placeholder="Suburbs or instructor name..." className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-medium" value={transmissionFilter} onChange={(e) => setTransmissionFilter(e.target.value)}>
              <option value="All">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
            <div className="flex items-center px-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl transition-colors">
              <i className="fas fa-location-arrow text-blue-500 mr-2"></i>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{userLocation ? 'Local Focus' : 'Location Off'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map(inst => (
              <div key={inst.id} className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 hover:shadow-xl transition-all cursor-pointer group" onClick={() => handleSelectInstructor(inst)}>
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img src={inst.avatar} alt={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold dark:text-white">${inst.pricePerHour}/hr</div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{inst.name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm font-bold"><i className="fas fa-star mr-1"></i>{inst.rating}</div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors"><i className="fas fa-map-marker-alt mr-1"></i>{inst.suburbs.join(', ')}</p>
                  <button className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border dark:border-slate-700 font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'PROFILE' && selectedInstructor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-8 transition-colors">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <img src={selectedInstructor.avatar} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt="" />
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-black dark:text-white">{selectedInstructor.name}</h2>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleShare} 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          copySuccess 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                        <span>{copySuccess ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>
                      <button 
                        onClick={() => openSocial('twitter')}
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all border dark:border-slate-700"
                        title="Share on Twitter"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button 
                        onClick={() => openSocial('facebook')}
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all border dark:border-slate-700"
                        title="Share on Facebook"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span><i className="fas fa-star text-yellow-400 mr-1"></i>{selectedInstructor.rating} Rating</span>
                    <span><i className="fas fa-car mr-1"></i>{selectedInstructor.carModel}</span>
                    <span><i className="fas fa-language mr-1"></i>{selectedInstructor.languages.join(', ')}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selectedInstructor.bio}</p>
                </div>
              </div>

              {/* Visual Instructor Calendar */}
              <div className="pt-8 border-t dark:border-slate-800 space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Select Availability</h4>
                  <p className="text-xs text-slate-500 mb-6 font-medium">Our 14-day rolling window for confirmed sessions.</p>
                </div>

                {/* Days Strip */}
                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                  {rollingDays.map((d) => (
                    <button 
                      key={d.date} 
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all border ${
                        selectedDate === d.date 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-blue-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">{d.day}</span>
                      <span className="text-sm font-black">{d.display.split(' ')[0]}</span>
                      <span className="text-[10px] font-bold opacity-60 uppercase">{d.display.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {TIME_SLOTS.map((time) => {
                    const taken = isSlotTaken(selectedDate, time);
                    const isSelected = selectedTime === time;
                    return (
                      <button 
                        key={time} 
                        disabled={taken}
                        onClick={() => setSelectedTime(time)}
                        className={`relative py-3 rounded-xl text-xs font-bold transition-all border ${
                          taken 
                          ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 border-slate-50 dark:border-slate-800 cursor-not-allowed' 
                          : isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-300'
                        }`}
                      >
                        {taken && <i className="fas fa-lock absolute top-1 right-2 text-[8px] opacity-40"></i>}
                        {time}
                        {isSelected && <i className="fas fa-check-circle absolute top-1 right-2 text-[10px]"></i>}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex items-center space-x-6 pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full border border-slate-200"></div><span>Available</span></div>
                  <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800"></div><span>Booked</span></div>
                  <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-blue-600"></div><span>Your Selection</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-6 shadow-xl sticky top-40 transition-colors">
              <h3 className="font-bold text-lg mb-6 dark:text-white">Summary</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Lesson Schedule</p>
                  <p className="text-sm font-bold dark:text-white">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Choose a date'}
                    <span className="text-blue-600 dark:text-blue-400 ml-1">{selectedTime ? `@ ${selectedTime}` : ''}</span>
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <button disabled={!selectedTime} onClick={() => handleConfirmBookingRequest('STANDARD')} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-30 hover:bg-blue-700 transition-all">Proceed to Booking</button>
                  <button disabled={!selectedTime} onClick={() => handleConfirmBookingRequest('TRIAL')} className="w-full py-3 bg-white dark:bg-slate-800 text-blue-600 border border-blue-600 font-bold rounded-xl disabled:opacity-30 hover:bg-blue-50 transition-all">Request Introductory Trial</button>
                </div>
                <CancellationPolicyBox />
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'CHECKOUT' && selectedInstructor && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-8 space-y-6 transition-colors shadow-sm">
              <h2 className="text-2xl font-bold dark:text-white transition-colors">Payment Secure</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Cardholder</label>
                   <input type="text" placeholder="e.g. John Citizen" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Card Number</label>
                   <input type="text" placeholder="•••• •••• •••• ••••" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button 
                  onClick={() => setShowConfirmModal(true)} 
                  disabled={isProcessing} 
                  className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Complete Secure Payment (${price}.00)</span>}
                </button>
              </div>
            </div>
            <CancellationPolicyBox />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 transition-colors h-fit">
            <h3 className="font-bold text-lg mb-6 dark:text-white">Booking Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-4 mb-6">
                 <img src={selectedInstructor.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
                 <div>
                    <p className="font-bold dark:text-white">{selectedInstructor.name}</p>
                    <p className="text-xs text-slate-500">Instructor @ DriveSafeMate</p>
                 </div>
              </div>
              <div className="flex justify-between"><span className="text-slate-500">Lesson Date</span><span className="font-bold dark:text-white">{selectedDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Lesson Time</span><span className="font-bold dark:text-white">{selectedTime}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Lesson Type</span><span className="font-bold dark:text-white">{label}</span></div>
              <hr className="dark:border-slate-700" />
              <div className="flex justify-between text-lg"><span className="font-bold dark:text-white">Total Amount</span><span className="font-bold text-blue-600">${price}.00 AUD</span></div>
            </div>
            <p className="mt-6 text-[10px] text-slate-400 italic text-center">Your data is secured by industry standard SSL encryption.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;
