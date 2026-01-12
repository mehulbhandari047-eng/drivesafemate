import React, { useState, useEffect } from 'react';
import { getLicenceGuidance } from '../services/geminiService';

const LicenceGuide: React.FC<{ state: string; currentStage: string }> = ({ state, currentStage }) => {
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      const data = await getLicenceGuidance(state, currentStage);
      if (data) setSteps(data);
      setLoading(false);
    };
    fetchGuide();
  }, [state, currentStage]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Analyzing State Regulations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Licence Roadmap: {state}</h3>
        <p className="text-sm text-slate-500 font-medium">Your personalized guide to driving independently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                index === 0 ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <h4 className={`font-bold uppercase tracking-widest text-[11px] ${index === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {step.title}
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {step.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {step.requirements.map((req: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[9px] font-bold rounded-lg uppercase border border-slate-100 dark:border-slate-700">
                  {req}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicenceGuide;