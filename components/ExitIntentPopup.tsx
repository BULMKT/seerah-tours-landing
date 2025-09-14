'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CheckCircle, ArrowRight, Sparkles, Heart } from 'lucide-react';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ems_copy_t';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if user has already seen this popup
    const hasSeenExitIntent = localStorage.getItem('exit_intent_shown');
    if (hasSeenExitIntent) {
      setHasShown(true);
      return;
    }

    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exit_intent_shown', 'true');
      }
    };

    // Also trigger after some time if user hasn't interacted
    const timer = setTimeout(() => {
      if (!hasShown && !localStorage.getItem('whatsapp_interacted')) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exit_intent_shown', 'true');
      }
    }, 45000); // Show after 45 seconds if no interaction

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown]);

  const closePopup = () => {
    setIsVisible(false);
  };

  const handleJoinGroup = async () => {
    setIsLoading(true);
    
    // Track WhatsApp group join
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_join', {
        event_category: 'WhatsApp Group',
        event_label: 'Exit Intent Popup',
        value: 1
      });
    }
    
    // Store interaction
    localStorage.setItem('whatsapp_interacted', 'true');
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setStep(2);
      
      // Open WhatsApp link
      window.open(WHATSAPP_GROUP_LINK, '_blank');
      
      // Auto-close after success
      setTimeout(() => {
        closePopup();
      }, 3000);
    }, 1000);
  };

  const handleAlreadyMember = () => {
    localStorage.setItem('whatsapp_interacted', 'true');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'already_member', {
        event_category: 'WhatsApp Group',
        event_label: 'Exit Intent Popup',
        value: 1
      });
    }
    closePopup();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-gradient-to-br from-blue-900 to-blue-800 bg-opacity-95 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-white hover:text-accent transition-colors duration-300 z-10"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-white bg-opacity-30'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-green-400' : 'bg-white bg-opacity-30'}`} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && !showSuccess ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center"
                >
                  {/* Header with animation */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-4"
                  >
                    🕋
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-heading font-bold text-white mb-3"
                  >
                    Wait! Don't Miss Out 
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block ml-2"
                    >
                      ✨
                    </motion.span>
                  </motion.h3>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <p className="text-white opacity-90 mb-4">
                      Join our caring WhatsApp community of <span className="font-bold text-accent">330+ UK Muslim families</span> preparing for Hajj 2026 together.
                    </p>
                    
                    <div className="text-left space-y-2">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 text-sm text-white opacity-80"
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>Daily inspiration and motivation</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-3 text-sm text-white opacity-80"
                      >
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>Connect with like-minded Muslims</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-3 text-sm text-white opacity-80"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>FREE exclusive Hajj preparation guides</span>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-3">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      onClick={handleJoinGroup}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-accent hover:bg-opacity-90 disabled:bg-opacity-70 text-primary font-heading font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                          />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          🕋 Join WhatsApp Group Now
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      onClick={handleAlreadyMember}
                      className="text-white opacity-60 hover:opacity-100 text-sm underline transition-opacity duration-300"
                    >
                      I'm already in the group
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">
                    Welcome to the Family! 
                  </h3>
                  <p className="text-white opacity-80 mb-4">
                    Opening WhatsApp... Check your notifications for the group invitation.
                  </p>
                  
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-accent font-semibold"
                  >
                    May Allah accept your intentions 🤲
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}