
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
    // Added missing isVerified property
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
    // Added missing isVerified property
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
    // Added missing isVerified property
    isVerified: true
  }
];

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const filteredInstructors = MOCK_INSTRUCTORS.map(inst => ({
    ...inst,
    distance: userLocation ? (Math.random() * 5 + 1) : undefined 
  })).filter(inst => {
    const matchesSearch = inst.suburbs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          inst.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTransmission = transmissionFilter === 'All' || inst.transmission === transmissionFilter || inst.transmission === 'Both';
    return matchesSearch && matchesTransmission;
  });

  const handleSelectInstructor = (inst: Instructor) => {
    setSelectedInstructor(inst);
    setStep('PROFILE');
  };

  const handleConfirmBooking = (mode: 'STANDARD' | 'TRIAL') => {
    if (selectedDate && selectedTime) {
      setBookingMode(mode);
      setStep('CHECKOUT');
    }
  };

  const getBookingDetails = () => {
    if (!selectedInstructor) return { price: 0, duration: 0, label: '' };
    if (bookingMode === 'TRIAL') {
      return {
        price: Math.round(selectedInstructor.pricePerHour * 0.6), // 60% of hourly rate for trial
        duration: 45,
        label: 'Introductory Trial Lesson'
      };
    }
    return {
      price: selectedInstructor.pricePerHour,
      duration: 60,
      label: 'Standard Practical Lesson'
    };
  };

  const { price, duration, label } = getBookingDetails();

  const handlePayment = () => {
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

  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">
          <i className="fas fa-check"></i>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">Your {label.toLowerCase()} with {selectedInstructor?.name} is all set for {selectedDate} at {selectedTime}.</p>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border dark:border-slate-800 sticky top-20 z-20 transition-colors">
        <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2 font-medium">
          <i className="fas fa-arrow-left"></i>
          <span>Back to Home</span>
        </button>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <span className={step === 'SEARCH' ? 'text-blue-600' : 'text-slate-400'}>Find</span>
          <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
          <span className={step === 'PROFILE' ? 'text-blue-600' : 'text-slate-400'}>Schedule</span>
          <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
          <span className={step === 'CHECKOUT' ? 'text-blue-600' : 'text-slate-400'}>Checkout</span>
        </div>
      </div>

      {step === 'SEARCH' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search by suburb or name..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-3 rounded-xl border dark:border-slate-800 outline-none bg-white dark:bg-slate-900 dark:text-white font-medium text-slate-700"
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
            >
              <option value="All">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
            <div className="flex items-center px-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
              <i className="fas fa-location-arrow text-blue-500 mr-2"></i>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{userLocation ? 'Near You' : 'Location Off'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map(inst => (
              <div key={inst.id} className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 hover:shadow-xl transition-all overflow-hidden flex flex-col group cursor-pointer" onClick={() => handleSelectInstructor(inst)}>
                <div className="relative h-48">
                  <img src={inst.avatar} alt={inst.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm dark:text-white">
                    ${inst.pricePerHour}/hr
                  </div>
                  {inst.distance && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                      {inst.distance.toFixed(1)} km away
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 flex space-x-1">
                    {inst.transmission === 'Both' ? (
                      <>
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Auto</span>
                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Manual</span>
                      </>
                    ) : (
                      <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{inst.transmission}</span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{inst.name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm font-bold">
                      <i className="fas fa-star mr-1"></i>
                      <span>{inst.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {inst.suburbs.join(', ')}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {inst.specialties.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium">{s}</span>
                    ))}
                  </div>
                  <button className="mt-auto w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border dark:border-slate-700 font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    View Availability
                  </button>
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
              <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
                <img src={selectedInstructor.avatar} className="w-24 h-24 rounded-2xl object-cover shadow-md" alt={selectedInstructor.name} />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h2 className="text-2xl font-bold dark:text-white">{selectedInstructor.name}</h2>
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Verified Partner</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span><i className="fas fa-star text-yellow-400 mr-1"></i>{selectedInstructor.rating} ({selectedInstructor.reviewCount} reviews)</span>
                    <span><i className="fas fa-car mr-1"></i>{selectedInstructor.carModel}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">{selectedInstructor.bio}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-50 dark:border-slate-800 transition-colors">
                <ProfileStat icon="fa-road" label="Total Lessons" value="1,400+" />
                <ProfileStat icon="fa-language" label="Languages" value={selectedInstructor.languages.join(', ')} />
                <ProfileStat icon="fa-certificate" label="Accreditation" value="Keys2Drive" />
                <ProfileStat icon="fa-id-card" label="License" value="NSW Instructor" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-6 shadow-lg shadow-slate-100 dark:shadow-none sticky top-40 transition-colors">
              <h3 className="font-bold text-lg mb-6 dark:text-white">Select Date & Time</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Lesson Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Available Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'].map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedTime === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:border-slate-700'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t dark:border-slate-800 mt-4 space-y-3">
                  <button 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => handleConfirmBooking('STANDARD')} 
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50 hover:bg-blue-700 transition-all"
                  >
                    Confirm Standard (1hr)
                  </button>
                  <button 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => handleConfirmBooking('TRIAL')} 
                    className="w-full py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 font-bold rounded-xl disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-sparkles text-xs"></i>
                    <span>Book Trial Lesson (45m)</span>
                  </button>
                  <p className="mt-4 text-[10px] text-center text-slate-400 dark:text-slate-500 font-medium transition-colors">
                    <i className="fas fa-info-circle mr-1"></i>
                    24h free cancellation applies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'CHECKOUT' && selectedInstructor && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-8 space-y-6 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold dark:text-white">Secure Payment</h2>
              <div className="space-y-4">
                <input type="text" placeholder="John Citizen" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                <div className="relative">
                  <input type="text" placeholder="•••• •••• •••• ••••" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1 opacity-50 dark:text-white">
                    <i className="fab fa-cc-visa text-xl"></i>
                    <i className="fab fa-cc-mastercard text-xl"></i>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  <input type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button onClick={handlePayment} disabled={isProcessing} className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2">
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Pay ${price}.00</span>}
                </button>
              </div>
            </div>

            {/* Cancellation Policy Block */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-6 transition-colors">
              <h4 className="flex items-center text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
                <i className="fas fa-clock mr-2"></i>
                Cancellation Policy
              </h4>
              <p className="text-xs text-blue-800/80 dark:text-blue-400 leading-relaxed font-medium">
                We value our instructors' time. You can cancel your lesson for a full refund up to <strong>24 hours</strong> before the scheduled start time. 
                Cancellations made within 24 hours of the lesson will incur a <strong>50% late fee</strong>. No-shows will be charged at 100%.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 shadow-sm h-fit transition-colors">
            <h3 className="font-bold text-lg mb-6 dark:text-white">Booking Summary</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <img src={selectedInstructor.avatar} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div>
                  <p className="font-bold dark:text-white">{selectedInstructor.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedInstructor.carModel}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Lesson Type</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Time</span>
                  <span className="font-medium dark:text-white">{selectedDate} @ {selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Duration</span>
                  <span className="font-medium dark:text-white">{duration} Mins</span>
                </div>
              </div>
              <hr className="dark:border-slate-700" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900 dark:text-white">Total AUD</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">${price}.00</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center">By paying, you agree to our 24h cancellation terms.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileStat = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <div className="text-center md:text-left">
    <div className="text-blue-600 dark:text-blue-400 mb-1 transition-colors">
      <i className={`fas ${icon}`}></i>
    </div>
    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider transition-colors">{label}</p>
    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate transition-colors">{value}</p>
  </div>
);

export default BookingSystem;
