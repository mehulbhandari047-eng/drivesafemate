
import React, { useState } from 'react';
import { User, Instructor } from '../types';
import { dbService } from '../services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  user: User;
  onComplete: (instructor: Instructor) => void;
}

const InstructorOnboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile State
  const [bio, setBio] = useState('');
  const [price, setPrice] = useState(75);
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual' | 'Both'>('Automatic');
  const [carModel, setCarModel] = useState('');
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [newSuburb, setNewSuburb] = useState('');

  const addSuburb = () => {
    if (newSuburb.trim() && !suburbs.includes(newSuburb)) {
      setSuburbs([...suburbs, newSuburb.trim()]);
      setNewSuburb('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const instructorData: Omit<Instructor, 'id' | 'rating' | 'reviewCount' | 'isVerified'> = {
        userId: user.id,
        name: user.name,
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
        bio,
        pricePerHour: price,
        transmission,
        carModel,
        suburbs,
        specialties: ['Beginner Basics'],
        languages: ['English'],
        available: true
      };
      
      const newInstructor = await dbService.onboardInstructor(instructorData);
      onComplete(newInstructor);
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-800">
        <div className="bg-amber-400 p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Partner Registration</h2>
            <p className="text-slate-900/60 font-bold text-sm uppercase tracking-widest">Step {step} of 3</p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-400 shadow-inner">
            <i className={`fas ${step === 1 ? 'fa-id-card' : step === 2 ? 'fa-car' : 'fa-check-double'}`}></i>
          </div>
        </div>

        <div className="p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-black dark:text-white">Tell us about yourself</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructor Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none resize-none" placeholder="Years of experience, teaching style, area expertise..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hourly Rate (AUD)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transmission</label>
                    <select value={transmission} onChange={(e) => setTransmission(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white outline-none">
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="Both">Both (Dual Controls)</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-amber-400 font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all">Next Step</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-black dark:text-white">Vehicle & Coverage</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Vehicle</label>
                  <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none" placeholder="e.g. 2024 Toyota Corolla Hybrid" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Areas (Suburbs)</label>
                  <div className="flex space-x-2">
                    <input type="text" value={newSuburb} onChange={(e) => setNewSuburb(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSuburb()} className="flex-1 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none" placeholder="Add a suburb..." />
                    <button onClick={addSuburb} className="px-6 bg-amber-400 text-slate-900 rounded-2xl font-black">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suburbs.map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold dark:text-white flex items-center space-x-2">
                        <span>{s}</span>
                        <button onClick={() => setSuburbs(suburbs.filter(x => x !== s))} className="text-red-500 hover:text-red-700"><i className="fas fa-times"></i></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setStep(1)} className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl">Back</button>
                  <button onClick={() => setStep(3)} disabled={suburbs.length === 0 || !carModel} className="py-5 bg-slate-900 text-amber-400 font-black rounded-2xl shadow-xl hover:bg-slate-800 disabled:opacity-50">Continue</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                  <i className="fas fa-shield-check"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white mb-2">Almost there!</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">By clicking finish, you confirm that you hold a valid Driving Instructor Authority and your vehicle is fitted with dual controls in accordance with state laws.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setStep(2)} className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl">Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="py-5 bg-slate-900 text-amber-400 font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-rocket"></i>}
                    <span>Complete Application</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InstructorOnboarding;
