'use client';

import { useState } from 'react';
import { Settings, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanel from './AdminPanel';

export default function AdminAccess() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simple password protection - in production, use proper authentication
  const ADMIN_PASSWORD = 'seerah2026admin';

  const handleAdminClick = () => {
    // Always show password prompt
    setShowAuth(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowAuth(false);
      setIsAdminOpen(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    setPassword('');
    setError('');
  };

  return (
    <>
      {/* Admin Access Button */}
      <motion.button
        onClick={handleAdminClick}
        className="fixed bottom-4 left-4 z-40 w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Admin Panel"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Password Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
                <p className="text-gray-600">Enter the admin password to continue</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Access Admin Panel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAuth(false)}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="mt-4 text-xs text-gray-500 text-center">
                🔒 This area is password protected
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={handleCloseAdmin} 
      />
    </>
  );
}