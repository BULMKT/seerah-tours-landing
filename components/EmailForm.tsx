'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import axios from 'axios';

interface EmailFormData {
  email: string;
}

interface EmailFormProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
}

export default function EmailForm({ onSuccess, className = '', buttonText = "Yes! Add Me to the WhatsApp Group" }: EmailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>();

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Submit email to API
      await axios.post('/api/subscribe', { email: data.email });
      
      setIsSuccess(true);
      reset();
      
      // Track conversion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'sign_up', {
          method: 'WhatsApp Group',
          event_category: 'engagement',
          event_label: 'Hajj 2026 Community'
        });
      }

      // Redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        const whatsappUrl = 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ems_copy_t';
        window.open(whatsappUrl, '_blank');
        onSuccess?.();
      }, 2000);

    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">Success!</h3>
          <p className="text-text-muted mb-4">Check your email and get ready to join our WhatsApp group!</p>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-accent font-semibold"
          >
            Redirecting to WhatsApp...
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-4 ${className} ${className?.includes('popup-form') ? 'popup-form-layout' : ''}`}
        >
          <div className={`gap-3 ${className?.includes('popup-form') ? 'flex flex-col' : 'flex flex-col sm:flex-row'}`}>
            <div className="flex-1">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                placeholder="Enter your email address"
                className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`btn-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center ${
                className?.includes('popup-form') ? 'w-full' : 'min-w-[200px] sm:min-w-[250px]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                buttonText
              )}
            </motion.button>
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
          
          <p className="text-xs text-text-muted text-center">
            By joining, you agree to receive daily tips and updates. Unsubscribe anytime.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}