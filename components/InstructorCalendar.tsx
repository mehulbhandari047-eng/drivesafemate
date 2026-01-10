
import React, { useState } from 'react';
import { AvailabilitySlot } from '../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

const InstructorCalendar: React.FC = () => {
  const [slots, setSlots] = useState<Record<string, boolean>>({});

  const toggleSlot = (day: string, time: string) => {
    const key = `${day}-${time}`;
    setSlots(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isBlocked = (day: string, time: string) => slots[`${day}-${time}`] || false;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden animate-fadeIn">
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Manage Availability</h3>
          <p className="text-sm text-slate-500 font-medium">Click slots to toggle between available and blocked time.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blocked</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            Save Schedule
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b bg-slate-50">
            <div className="p-4 border-r"></div>
            {DAYS.map(day => (
              <div key={day} className="p-4 text-center border-r last:border-r-0">
                <span className="text-sm font-bold text-slate-700">{day}</span>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          {TIMES.map(time => (
            <div key={time} className="grid grid-cols-8 border-b last:border-b-0 group">
              <div className="p-4 border-r bg-slate-50 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{time}</span>
              </div>
              {DAYS.map(day => {
                const blocked = isBlocked(day, time);
                return (
                  <button
                    key={`${day}-${time}`}
                    onClick={() => toggleSlot(day, time)}
                    className={`p-4 border-r last:border-r-0 transition-all h-16 flex items-center justify-center relative group/slot ${
                      blocked ? 'bg-slate-100' : 'bg-emerald-50/30 hover:bg-emerald-100/50'
                    }`}
                  >
                    {blocked ? (
                      <div className="flex flex-col items-center animate-scaleIn">
                        <i className="fas fa-ban text-slate-300 text-xs mb-1"></i>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Blocked</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center opacity-0 group-hover/slot:opacity-100 transition-opacity">
                         <i className="fas fa-check text-emerald-500 text-xs mb-1"></i>
                         <span className="text-[8px] font-bold text-emerald-600 uppercase">Available</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t flex items-center space-x-2">
        <i className="fas fa-info-circle text-blue-500 text-xs"></i>
        <p className="text-[10px] font-medium text-slate-500 italic">Blocked slots will not be visible to students in the booking search results.</p>
      </div>
    </div>
  );
};

export default InstructorCalendar;
