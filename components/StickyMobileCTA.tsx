'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, CheckCircle, X, ArrowRight, Sparkles } from 'lucide-react';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ems_copy_t';

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has interacted with WhatsApp before
    const interacted = localStorage.getItem('whatsapp_mobile_cta_interacted');
    if (interacted) {
      setHasInteracted(true);
    }

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.3; // Show after scrolling 30% of viewport
      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinWhatsApp = async () => {
    setIsLoading(true);
    
    // Track interaction
    setHasInteracted(true);
    localStorage.setItem('whatsapp_mobile_cta_interacted', 'true');
    
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_join', {
        event_category: 'WhatsApp Group',
        event_label: 'Sticky Mobile CTA',
        value: 1
      });
    }

    // Simulate brief loading for better UX
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Open WhatsApp link
      window.open(WHATSAPP_GROUP_LINK, '_blank');
      
      // Auto-hide success and close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setShowForm(false);
      }, 2000);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-end justify-center z-50 md:hidden"
                onClick={() => !isLoading && setShowForm(false)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 20 }}
                  className="bg-white w-full p-6 rounded-t-2xl shadow-2xl border-t-4 border-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => !isLoading && setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <Users className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                      Join Our Hajj Family
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                      <Sparkles className="w-4 h-4" />
                      <span>330+ UK Muslim families</span>
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Daily Hajj preparation tips at 9am</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Weekly live Q&A with experts</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">FREE comprehensive guides</span>
                    </motion.div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <AnimatePresence mode="wait">
                      {showSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold py-4 px-4 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Opening WhatsApp...</span>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="button"
                          onClick={handleJoinWhatsApp}
                          disabled={isLoading}
                          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Joining...</span>
                            </>
                          ) : (
                            <>
                              🕋 Join WhatsApp Community
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Trusted by Muslim families across the UK
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sticky Button */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white to-gray-50 border-t-2 border-accent p-4 z-40 md:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">330+ members</span>
              </div>
              {!hasInteracted && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2
                  }}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold"
                >
                  NEW
                </motion.div>
              )}
            </div>
            
            <motion.button
              onClick={() => setShowForm(true)}
              className="w-full btn-primary relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 8px rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="flex items-center justify-center gap-2"
                animate={!hasInteracted ? {
                  x: [0, 2, -2, 0]
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: !hasInteracted ? Infinity : 0,
                  repeatDelay: 3
                }}
              >
                🕋 Join WhatsApp Group - FREE
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}