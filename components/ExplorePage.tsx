
import React, { useState, useEffect } from 'react';
import { Instructor, User } from '../types';
import { dbService } from '../services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplorePageProps {
  student: User | null;
  onBack: () => void;
  onBookInstructor: (instructor: Instructor) => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ student, onBack, onBookInstructor }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTransmission, setFilterTransmission] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInst, setSelectedInst] = useState<Instructor | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await dbService.getInstructors();
      setInstructors(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const filtered = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inst.suburbs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrans = filterTransmission === 'All' || inst.transmission === filterTransmission;
    return matchesSearch && matchesTrans;
  });

  return (
    <div className="pt-24 pb-40 px-8 md:px-20 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter dark:text-white">Find your Supercoach.</h1>
            <p className="text-slate-500 font-medium text-lg mt-2">Verified professional instructors across Australia's major cities.</p>
          </div>
          <div className="airbnb-pill flex items-center bg-white dark:bg-slate-900 px-8 py-4 w-full md:w-[450px]">
            <i className="fas fa-search text-slate-400 mr-4"></i>
            <input 
              type="text" 
              placeholder="Search by suburb or name..." 
              className="bg-transparent border-none outline-none w-full text-sm font-black dark:text-white placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide border-b border-slate-100 dark:border-slate-800">
          {['All', 'Automatic', 'Manual'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterTransmission(type)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${filterTransmission === type ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {filtered.map(inst => (
              <motion.div 
                key={inst.id} 
                layoutId={inst.id}
                onClick={() => setSelectedInst(inst)}
                className="cursor-pointer group"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-5 relative shadow-sm border border-slate-100 dark:border-slate-800">
                  <img src={inst.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={inst.name} />
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-premium tracking-widest">Supercoach</div>
                </div>
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white group-hover:underline">{inst.name}</h4>
                    <p className="text-slate-500 font-medium text-sm">{inst.transmission} Specialist • {inst.suburbs[0]}</p>
                    <p className="text-lg font-black mt-2 dark:text-white">${inst.pricePerHour} <span className="font-medium text-slate-400">/ hr</span></p>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-sm">
                     <i className="fas fa-star text-[10px]"></i>
                     <span>{inst.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Instructor Detail Modal */}
      <AnimatePresence>
        {selectedInst && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, y: 100 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: 100 }}
               className="bg-white dark:bg-slate-900 w-full max-w-7xl rounded-[4rem] shadow-floating flex flex-col md:flex-row h-[90vh] overflow-hidden border dark:border-slate-800"
             >
                <div className="w-full md:w-1/2 h-full overflow-hidden bg-slate-100">
                   <img src={selectedInst.avatar} className="w-full h-full object-cover" alt={selectedInst.name} />
                </div>
                <div className="flex-1 p-16 overflow-y-auto relative bg-white dark:bg-slate-900">
                   <button onClick={() => setSelectedInst(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-premium hover:bg-white transition-all"><i className="fas fa-times"></i></button>
                   
                   <div className="flex flex-col gap-10">
                      <div>
                         <h2 className="text-5xl font-black tracking-tighter dark:text-white">{selectedInst.name}</h2>
                         <div className="flex items-center space-x-4 mt-3">
                            <span className="flex items-center space-x-1 font-black text-lg"><i className="fas fa-star text-sm"></i><span>{selectedInst.rating}</span></span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-slate-900 dark:text-white underline decoration-2 underline-offset-4">{selectedInst.reviewCount} Reviews</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-black text-slate-500 uppercase text-xs tracking-widest">{selectedInst.suburbs[0]}</span>
                         </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-10">
                         <div className="flex items-start space-x-6 mb-10">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl text-slate-400 flex-shrink-0">
                               <i className="fas fa-user-tie"></i>
                            </div>
                            <div>
                               <h4 className="font-black text-xl dark:text-white">Hosted by a Supercoach</h4>
                               <p className="text-slate-500 font-medium leading-relaxed">Supercoaches are experienced, highly rated instructors who are committed to providing great experiences for learners.</p>
                            </div>
                         </div>
                      </div>

                      <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">{selectedInst.bio}</p>
                      
                      <div className="grid grid-cols-2 gap-8 mb-12">
                         <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Technical Gear</p>
                            <p className="font-black text-xl dark:text-white">{selectedInst.carModel}</p>
                            <p className="text-sm text-slate-500 mt-1">{selectedInst.transmission} Gearbox</p>
                         </div>
                         <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Academy Status</p>
                            <p className="font-black text-xl dark:text-white">Top 1% Coach</p>
                            <p className="text-sm text-slate-500 mt-1">First-time pass priority</p>
                         </div>
                      </div>

                      <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
                         <div>
                            <p className="text-3xl font-black dark:text-white">${selectedInst.pricePerHour} <span className="font-medium text-slate-400 text-lg">/ lesson</span></p>
                            <p className="text-sm font-bold text-slate-500 underline decoration-slate-300">Free pickup included</p>
                         </div>
                         <button 
                           onClick={() => {
                             onBookInstructor(selectedInst);
                             setSelectedInst(null);
                           }} 
                           className="px-14 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xl shadow-floating hover:opacity-90 active:scale-95 transition-all"
                         >
                           Reserve Experience
                         </button>
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

export default ExplorePage;
