
import React, { useState, useEffect } from 'react';
import { emailService } from '../services/emailService';
import { EmailNotification } from '../types';

const NotificationToast: React.FC = () => {
  const [notification, setNotification] = useState<EmailNotification | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = emailService.subscribe((n) => {
      setNotification(n);
      // Auto hide toast after 6 seconds
      setTimeout(() => setNotification(null), 6000);
    });
    return unsubscribe;
  }, []);

  if (!notification) return null;

  return (
    <>
      {/* Toast Notification */}
      <div className="fixed top-20 right-6 z-[100] w-80 animate-slideInRight">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden ring-4 ring-blue-500/10">
          <div className="p-4 flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              notification.type === 'CANCELLATION' ? 'bg-red-100 text-red-600' : 
              notification.type === 'CONFIRMATION' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Email Received</p>
              <h4 className="text-sm font-bold text-slate-900 truncate">{notification.subject}</h4>
              <p className="text-xs text-slate-500 mt-1">Sent to {notification.to}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-300 hover:text-slate-500">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 bg-slate-50 border-t text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            View Full Email Content
          </button>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-steering-wheel text-white text-sm"></i>
                </div>
                <span className="text-white font-bold tracking-tight">DriveSafeMate Notification</span>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-8 border-b bg-slate-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Subject</p>
                  <h3 className="text-lg font-bold text-slate-900">{notification.subject}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Received</p>
                  <p className="text-sm font-medium text-slate-600">{notification.timestamp}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">To: <strong>{notification.to}</strong></p>
            </div>
            <div className="p-8 bg-white max-h-[60vh] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: notification.body }} />
            </div>
            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationToast;
