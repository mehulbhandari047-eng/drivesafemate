
import React from 'react';
import { TrainingType } from '../types';

interface TrainingHubProps {
  modules: any[];
}

const TrainingHub: React.FC<TrainingHubProps> = ({ modules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border p-6 shadow-sm border-t-4 border-t-emerald-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <i className="fas fa-laptop-code text-emerald-500"></i>
            <h3 className="font-bold">Online Theory</h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Self-Paced</span>
        </div>
        <div className="space-y-4">
          {modules.filter(m => m.type === 'ONLINE').map((m, i) => (
            <div key={i} className="p-4 rounded-xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-emerald-600">{m.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{m.description}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-play text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm border-t-4 border-t-blue-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <i className="fas fa-car-side text-blue-500"></i>
            <h3 className="font-bold">Practical Lessons</h3>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">With Instructor</span>
        </div>
        <div className="space-y-4">
          {modules.filter(m => m.type === 'OFFLINE').map((m, i) => (
            <div key={i} className="p-4 rounded-xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600">{m.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{m.description}</p>
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-2">
                  <i className="fas fa-clock mr-1"></i> {m.estimatedHours} HOURS TARGET
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingHub;
