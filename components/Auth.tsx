
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { dbService } from '../services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onClose, initialMode = 'LOGIN' }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'LOGIN') {
        const user = await dbService.login(email, password);
        if (user) onAuthSuccess(user);
        else setError("Invalid credentials. Try our quick access demos!");
      } else {
        const newUser = await dbService.registerUser({ name, email, password, role });
        onAuthSuccess(newUser);
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = async (targetRole: UserRole) => {
    setIsLoading(true);
    const demoUser = dbService.getMockUserByRole(targetRole);
    // Simulate a bit of loading for realism
    await new Promise(r => setTimeout(r, 800));
    onAuthSuccess(demoUser);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-slate-800"
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <i className="fas fa-steering-wheel text-slate-900"></i>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">DriveSafeMate</span>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {mode === 'LOGIN' ? "Welcome Back!" : "Join the Academy"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              {mode === 'LOGIN' ? "Continue your road to independence." : "Australia's premium driver network awaits."}
            </p>
          </div>

          {/* Quick Access Section for Testing */}
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Quick Access Demos</p>
             <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleQuickAccess(UserRole.STUDENT)}
                  className="flex flex-col items-center p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 shadow-sm group"
                >
                   <i className="fas fa-user-graduate text-blue-500 mb-1 group-hover:scale-110 transition-transform"></i>
                   <span className="text-[9px] font-black uppercase">Student</span>
                </button>
                <button 
                  onClick={() => handleQuickAccess(UserRole.INSTRUCTOR)}
                  className="flex flex-col items-center p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 shadow-sm group"
                >
                   <i className="fas fa-id-card text-emerald-500 mb-1 group-hover:scale-110 transition-transform"></i>
                   <span className="text-[9px] font-black uppercase">Coach</span>
                </button>
                <button 
                  onClick={() => handleQuickAccess(UserRole.ADMIN)}
                  className="flex flex-col items-center p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 shadow-sm group"
                >
                   <i className="fas fa-shield-halved text-amber-500 mb-1 group-hover:scale-110 transition-transform"></i>
                   <span className="text-[9px] font-black uppercase">Admin</span>
                </button>
             </div>
          </div>

          <div className="relative mb-8">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
             <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-bold">Or use credentials</span></div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-800 flex items-center space-x-2">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'SIGNUP' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium" placeholder="e.g. John Citizen" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portal Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-3 rounded-xl text-xs font-black border-2 transition-all ${role === UserRole.STUDENT ? 'bg-amber-400 border-amber-400 text-slate-900' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}>STUDENT</button>
                      <button type="button" onClick={() => setRole(UserRole.INSTRUCTOR)} className={`py-3 rounded-xl text-xs font-black border-2 transition-all ${role === UserRole.INSTRUCTOR ? 'bg-amber-400 border-amber-400 text-slate-900' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}>INSTRUCTOR</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium" placeholder="citizen@example.com.au" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {mode === 'LOGIN' && <button type="button" className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase">Forgot?</button>}
              </div>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-6 py-4 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium" placeholder="••••••••" />
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full py-5 bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-900 font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 mt-6 disabled:opacity-50"
            >
              {isLoading ? (
                <><i className="fas fa-circle-notch animate-spin"></i><span>Processing...</span></>
              ) : (
                <span>{mode === 'LOGIN' ? "Sign In" : "Register Account"}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
              className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {mode === 'LOGIN' ? "New here? Create an account" : "Already registered? Sign in instead"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
