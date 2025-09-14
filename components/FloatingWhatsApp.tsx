'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Users, ArrowRight } from 'lucide-react';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ems_copy_t';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    // Check if user has interacted before (localStorage)
    const interacted = localStorage.getItem('whatsapp_interacted');
    if (interacted) {
      setHasInteracted(true);
      setShowPulse(false);
    }
    // Remove auto-popup behavior - only show on click
  }, []);

  const handleJoinGroup = () => {
    setHasInteracted(true);
    setShowPulse(false);
    localStorage.setItem('whatsapp_interacted', 'true');
    
    // Track WhatsApp group join
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_join', {
        event_category: 'WhatsApp Group',
        event_label: 'Floating Button',
        value: 1
      });
    }
    
    window.open(WHATSAPP_GROUP_LINK, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            className="absolute bottom-16 right-0 bg-white bg-opacity-95 backdrop-blur-sm border border-accent rounded-xl p-6 shadow-2xl w-80 mb-2"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bree font-bold text-primary text-base">Join Our Hajj Family</h3>
                  <p className="text-sm text-green-600 font-semibold">330+ UK Muslim families</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Daily Hajj preparation tips at 9am</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Weekly live Q&A with experts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>FREE comprehensive guides</span>
              </div>
            </div>

            <button
              onClick={handleJoinGroup}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🕋 Join WhatsApp Community
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              Trusted by Muslim families across the UK
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 border-2 border-white"
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Notification badge */}
        {!hasInteracted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">!</span>
          </motion.div>
        )}
        
        {/* Pulse effect */}
        {showPulse && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-green-400 rounded-full -z-10"
          />
        )}
      </motion.button>
    </div>
  );
}