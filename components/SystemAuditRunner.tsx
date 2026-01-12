
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { diagnosticService, TestStep } from '../services/diagnosticService';

interface SystemAuditRunnerProps {
  onClose: () => void;
}

const SystemAuditRunner: React.FC<SystemAuditRunnerProps> = ({ onClose }) => {
  const [steps, setSteps] = useState<TestStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<'SUCCESS' | 'FAILURE' | null>(null);

  const startAudit = async () => {
    setIsRunning(true);
    setAuditResult(null);
    const success = await diagnosticService.runAutomatedAudit(setSteps);
    setAuditResult(success ? 'SUCCESS' : 'FAILURE');
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] shadow-floating overflow-hidden border dark:border-slate-800"
      >
        <div className="bg-slate-900 px-10 py-8 flex items-center justify-between border-b border-slate-800">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-brand-400 rounded-xl flex items-center justify-center text-slate-900">
                 <i className="fas fa-microchip"></i>
              </div>
              <div>
                 <h2 className="text-xl font-black text-white tracking-tight">System Integrity Audit</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Automation Engine v2.4</p>
              </div>
           </div>
           {!isRunning && (
             <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
               <i className="fas fa-times text-xl"></i>
             </button>
           )}
        </div>

        <div className="p-10 bg-slate-50 dark:bg-slate-950/50">
           {steps.length === 0 ? (
             <div className="py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-3xl mx-auto shadow-sm border dark:border-slate-800">
                   <i className="fas fa-vials text-brand-500"></i>
                </div>
                <div className="max-w-md mx-auto">
                   <h3 className="text-2xl font-black dark:text-white mb-2">Ready for System Pulse?</h3>
                   <p className="text-slate-500 font-medium">This audit will perform live transactions and AI reasoning tests to verify full-stack health.</p>
                </div>
                <button 
                  onClick={startAudit}
                  className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Initiate Full Audit
                </button>
             </div>
           ) : (
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {steps.map((step) => (
                  <div key={step.id} className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                    step.status === 'RUNNING' ? 'bg-white dark:bg-slate-900 border-brand-400 shadow-md scale-[1.02]' :
                    step.status === 'PASS' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20' :
                    step.status === 'FAIL' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20' :
                    'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-50'
                  }`}>
                    <div className="flex items-center space-x-5">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                         step.status === 'RUNNING' ? 'bg-brand-400 text-slate-900' :
                         step.status === 'PASS' ? 'bg-emerald-500 text-white' :
                         step.status === 'FAIL' ? 'bg-rose-500 text-white' :
                         'bg-slate-100 dark:bg-slate-800 text-slate-400'
                       }`}>
                          {step.status === 'RUNNING' ? <i className="fas fa-spinner animate-spin"></i> : 
                           step.status === 'PASS' ? <i className="fas fa-check"></i> :
                           step.status === 'FAIL' ? <i className="fas fa-times"></i> :
                           <i className={`fas ${step.category === 'AI' ? 'fa-brain' : step.category === 'PAYMENT' ? 'fa-credit-card' : 'fa-server'}`}></i>}
                       </div>
                       <div>
                          <p className={`font-black tracking-tight ${step.status === 'FAIL' ? 'text-rose-600' : 'dark:text-white'}`}>{step.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{step.message}</p>
                       </div>
                    </div>
                    {step.latency && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.latency}ms</span>
                    )}
                  </div>
                ))}
             </div>
           )}
        </div>

        {auditResult && (
          <div className={`px-10 py-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 ${auditResult === 'SUCCESS' ? 'bg-emerald-50 dark:bg-emerald-900/5' : 'bg-rose-50 dark:bg-rose-900/5'}`}>
             <div className="flex items-center space-x-3">
                <i className={`fas ${auditResult === 'SUCCESS' ? 'fa-check-circle text-emerald-500' : 'fa-exclamation-triangle text-rose-500'} text-xl`}></i>
                <span className={`font-black uppercase tracking-widest text-sm ${auditResult === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {auditResult === 'SUCCESS' ? 'System Certified Healthy' : 'Action Required: Failures Detected'}
                </span>
             </div>
             <button 
               onClick={onClose}
               className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
             >
               Close Audit Report
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SystemAuditRunner;
