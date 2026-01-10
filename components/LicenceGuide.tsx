
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
      <div className="bg-white rounded-2xl border p-8 shadow-sm flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Fetching Australian Licensing Regulations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
          <i className="fas fa-map-signs text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Licence Roadmap: {state}</h3>
          <p className="text-sm text-slate-500">Your personalised guide to becoming a fully licensed driver.</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

        <div className="space-y-10 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex space-x-6 group">
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                index === 0 ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-100 text-slate-300'
              }`}>
                {index === 0 ? <i className="fas fa-check text-xs"></i> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <div className="flex-1 pb-2">
                <h4 className={`font-bold text-lg mb-1 ${index === 0 ? 'text-blue-600' : 'text-slate-800'}`}>{step.title}</h4>
                <p className="text-sm text-slate-500 mb-3">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.requirements.map((req: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full uppercase border">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LicenceGuide;
