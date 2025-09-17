'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Mail, 
  X,
  ChevronDown,
  Loader2,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import CalendlyWidget from '@/components/CalendlyWidget';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ems_copy_t';

// Enhanced form validation schema with better error messages
const formSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  cityCountry: z.string().min(2, 'Please enter your city and country'),
  previousExperience: z.enum(['Hajj', 'Umrah', 'Both', 'Neither'], {
    errorMap: () => ({ message: 'Please select your previous experience' })
  }),
  hajjStatus: z.enum(['Just researching', 'Seriously considering', 'Committed'], {
    errorMap: () => ({ message: 'Please select your current status' })
  }),
  travellingWith: z.enum(['Solo', 'Spouse/Family', 'Friends/Group', 'Undecided'], {
    errorMap: () => ({ message: 'Please select who you\'re travelling with' })
  }),
  travellerCount: z.number().min(1).max(20).optional(),
  departurePreference: z.enum(['Manchester', 'London']).optional(),
  roomingPreference: z.enum(['Quad', 'Triple', 'Double/Twin', 'Single', 'Flexible']).optional(),
  mobilityConsiderations: z.string().optional(),
  callGoals: z.string().min(10, 'Please share your questions or concerns (at least 10 characters)'),
  hearAboutUs: z.enum(['Friend/Family', 'Masjid', 'YouTube', 'Instagram', 'TikTok', 'Google', 'Other']).optional(),
  hearAboutUsOther: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'You must agree to be contacted to proceed'),
});

type FormData = z.infer<typeof formSchema>;

const FAQ = [
  {
    question: "How long is the call?",
    answer: "Typically 15–30 minutes. We keep it focused on your specific needs and questions."
  },
  {
    question: "Do I need all documents ready?",
    answer: "No — this call is to understand your needs and provide guidance. Documents come later in the process."
  },
  {
    question: "Can I include my family?",
    answer: "Absolutely! Family members are welcome to join from one device. We encourage it for group bookings."
  },
  {
    question: "What happens after I submit this form?",
    answer: "You'll be redirected to join our WhatsApp group and optionally can schedule a personalised call with our team."
  }
];

export default function FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showCalendlyOption, setShowCalendlyOption] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });

  const watchTravellingWith = watch('travellingWith');
  const watchHearAboutUs = watch('hearAboutUs');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/hajj-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmittedData(data);
        setShowSuccess(true);
        reset();
        
        // Show WhatsApp redirect with optional Calendly after 2 seconds
        setTimeout(() => {
          setShowCalendlyOption(true);
        }, 2000);
        
      } else {
        throw new Error(result.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    // Track the redirect
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_redirect', {
        event_category: 'Form Completion',
        event_label: 'WhatsApp Group Join'
      });
    }
    
    window.open(WHATSAPP_GROUP_LINK, '_blank');
  };

  const handleScheduleCall = () => {
    setShowCalendly(true);
  };

  const handleSkipCall = () => {
    handleWhatsAppRedirect();
  };

  // Form field validation states
  const getFieldState = (fieldName: keyof FormData) => {
    if (errors[fieldName]) return 'error';
    if (touchedFields[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Navigation */}
        <Link 
          href="/"
          className="inline-flex items-center text-accent hover:text-white transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-12">
          <Image
            src="/seerah logo.png"
            alt="Seerah Tours"
            width={200}
            height={80}
            className="mx-auto mb-8"
          />
        </div>

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bree font-bold text-white mb-6">
                  Get Personalised Hajj Guidance
                </h1>
                <p className="text-xl text-white opacity-80 max-w-3xl mx-auto mb-8">
                  Share your plans with us and get expert advice tailored to your needs. 
                  After submitting, you'll join our supportive community and optionally schedule a personal consultation.
                </p>
                
                {/* Progress Indicator */}
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between text-sm text-white opacity-60 mb-2">
                    <span>Form Completion</span>
                    <span>Step 1 of 2</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
                  </div>
                  <p className="text-xs text-white opacity-50 mt-2">
                    Next: Join WhatsApp Community
                  </p>
                </div>
              </motion.div>

              {/* Main Form */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-8 shadow-lg mb-8">
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-200 font-semibold">Submission Failed</h3>
                      <p className="text-red-300 text-sm">{submitError}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Two-column grid on desktop */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('fullName')}
                          className={`w-full px-4 py-3 bg-white bg-opacity-90 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary transition-colors ${
                            getFieldState('fullName') === 'error' ? 'border-red-400' : 
                            getFieldState('fullName') === 'success' ? 'border-green-400' : 'border-transparent'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {getFieldState('fullName') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {errors.fullName && (
                        <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('email')}
                          type="email"
                          className={`w-full px-4 py-3 bg-white bg-opacity-90 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary transition-colors ${
                            getFieldState('email') === 'error' ? 'border-red-400' : 
                            getFieldState('email') === 'success' ? 'border-green-400' : 'border-transparent'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {getFieldState('email') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Phone Number <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('phone')}
                          type="tel"
                          className={`w-full px-4 py-3 bg-white bg-opacity-90 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary transition-colors ${
                            getFieldState('phone') === 'error' ? 'border-red-400' : 
                            getFieldState('phone') === 'success' ? 'border-green-400' : 'border-transparent'
                          }`}
                          placeholder="+44 7XX XXX XXXX"
                        />
                        {getFieldState('phone') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* City & Country */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        City & Country <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('cityCountry')}
                          className={`w-full px-4 py-3 bg-white bg-opacity-90 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary transition-colors ${
                            getFieldState('cityCountry') === 'error' ? 'border-red-400' : 
                            getFieldState('cityCountry') === 'success' ? 'border-green-400' : 'border-transparent'
                          }`}
                          placeholder="London, UK"
                        />
                        {getFieldState('cityCountry') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {errors.cityCountry && (
                        <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.cityCountry.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Previous Experience */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Have you performed Hajj/Umrah before? <span className="text-accent">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Hajj', 'Umrah', 'Both', 'Neither'].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            {...register('previousExperience')}
                            type="radio"
                            value={option}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center transition-colors ${
                              watch('previousExperience') === option ? 'border-accent bg-accent' : 'border-accent'
                            }`}>
                              {watch('previousExperience') === option && (
                                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                              )}
                            </div>
                            <span className="text-white">{option}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.previousExperience && (
                      <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.previousExperience.message}
                      </p>
                    )}
                  </div>

                  {/* Hajj Status */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Status for next Hajj <span className="text-accent">*</span>
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['Just researching', 'Seriously considering', 'Committed'].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            {...register('hajjStatus')}
                            type="radio"
                            value={option}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center transition-colors ${
                              watch('hajjStatus') === option ? 'border-accent bg-accent' : 'border-accent'
                            }`}>
                              {watch('hajjStatus') === option && (
                                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                              )}
                            </div>
                            <span className="text-white">{option}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.hajjStatus && (
                      <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.hajjStatus.message}
                      </p>
                    )}
                  </div>

                  {/* Travelling Party */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Who are you travelling with? <span className="text-accent">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {['Solo', 'Spouse/Family', 'Friends/Group', 'Undecided'].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            {...register('travellingWith')}
                            type="radio"
                            value={option}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center transition-colors ${
                              watch('travellingWith') === option ? 'border-accent bg-accent' : 'border-accent'
                            }`}>
                              {watch('travellingWith') === option && (
                                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                              )}
                            </div>
                            <span className="text-white text-sm">{option}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    {/* Conditional traveller count */}
                    {watchTravellingWith && watchTravellingWith !== 'Solo' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4"
                      >
                        <label className="block text-white font-semibold mb-2">
                          How many travellers (including you)?
                        </label>
                        <Controller
                          name="travellerCount"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              min="1"
                              max="20"
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="w-32 px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary"
                              placeholder="2"
                            />
                          )}
                        />
                      </motion.div>
                    )}

                    {errors.travellingWith && (
                      <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.travellingWith.message}
                      </p>
                    )}
                  </div>

                  {/* Two-column optional fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Departure Preference */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Departure airport preference
                      </label>
                      <select
                        {...register('departurePreference')}
                        className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary"
                      >
                        <option value="">Select preference</option>
                        <option value="Manchester">Manchester</option>
                        <option value="London">London</option>
                      </select>
                    </div>

                    {/* Rooming Preference */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Rooming preference
                      </label>
                      <select
                        {...register('roomingPreference')}
                        className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary"
                      >
                        <option value="">Select preference</option>
                        <option value="Quad">Quad</option>
                        <option value="Triple">Triple</option>
                        <option value="Double/Twin">Double/Twin</option>
                        <option value="Single">Single</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Mobility Considerations */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Mobility/medical considerations we should be aware of?
                    </label>
                    <textarea
                      {...register('mobilityConsiderations')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary resize-none"
                      placeholder="Any mobility needs, medical conditions, or accessibility requirements..."
                    />
                  </div>

                  {/* Call Goals */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      What questions or concerns do you have about Hajj? <span className="text-accent">*</span>
                    </label>
                    <textarea
                      {...register('callGoals')}
                      rows={4}
                      className={`w-full px-4 py-3 bg-white bg-opacity-90 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary resize-none transition-colors ${
                        getFieldState('callGoals') === 'error' ? 'border-red-400' : 
                        getFieldState('callGoals') === 'success' ? 'border-green-400' : 'border-transparent'
                      }`}
                      placeholder="Share your top questions or concerns. For example: package comparisons, pricing, group dynamics, preparation timeline, etc."
                    />
                    {errors.callGoals && (
                      <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.callGoals.message}
                      </p>
                    )}
                  </div>

                  {/* How did you hear about us */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      How did you hear about Seerah Tours?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {['Friend/Family', 'Masjid', 'YouTube', 'Instagram', 'TikTok', 'Google', 'Other'].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            {...register('hearAboutUs')}
                            type="radio"
                            value={option}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center transition-colors ${
                              watch('hearAboutUs') === option ? 'border-accent bg-accent' : 'border-accent'
                            }`}>
                              {watch('hearAboutUs') === option && (
                                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                              )}
                            </div>
                            <span className="text-white text-sm">{option}</span>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Conditional other field */}
                    {watchHearAboutUs === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4"
                      >
                        <input
                          {...register('hearAboutUsOther')}
                          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary"
                          placeholder="Please specify..."
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start cursor-pointer">
                      <input
                        {...register('consent')}
                        type="checkbox"
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 flex items-center justify-center transition-colors ${
                        watch('consent') ? 'border-accent bg-accent' : errors.consent ? 'border-red-400' : 'border-accent'
                      }`}>
                        {watch('consent') && <Check className="w-3 h-3 text-primary" />}
                      </div>
                      <span className="text-white text-sm">
                        I agree to be contacted about my Hajj planning and to join the WhatsApp community. See{' '}
                        <Link href="/privacy" className="text-accent hover:underline">
                          Privacy Policy
                        </Link>
                        . <span className="text-accent">*</span>
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.consent.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden"
                    >
                      <AnimatePresence>
                        {isSubmitting ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center"
                          >
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </motion.div>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Submit Form & Schedule Call 🕋
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    
                    {/* Progress indicator */}
                    {isSubmitting && (
                      <div className="mt-3 text-center">
                        <div className="text-white opacity-60 text-sm flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="ml-2">Saving your information...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reassurance */}
                  <div className="flex items-center justify-center gap-6 pt-4 text-white opacity-60 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span>No Spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Join 330+ Families</span>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            /* SUCCESS FLOW */
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Success Message */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-8 shadow-lg mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bree font-bold text-white mb-4">
                  Alhamdulillah! Form Submitted Successfully
                </h2>
                <p className="text-white opacity-80 mb-6 text-lg">
                  JazakAllah Khair {submittedData?.fullName}! Your information has been saved and our team will review it.
                </p>
                
                {/* Progress Indicator */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="flex items-center justify-between text-sm text-white opacity-60 mb-2">
                    <span>Progress</span>
                    <span>Step 2 of 2</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <motion.div 
                      className="bg-accent h-2 rounded-full"
                      initial={{ width: '50%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                  <p className="text-xs text-white opacity-50 mt-2">
                    Almost there! Join our community now
                  </p>
                </div>
              </motion.div>

              {/* Next Steps */}
              <AnimatePresence>
                {!showCalendlyOption ? (
                  <motion.div
                    className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-8 shadow-lg"
                  >
                    <h3 className="text-xl font-bree font-bold text-white mb-4">
                      Redirecting you to our WhatsApp community...
                    </h3>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                  </motion.div>
                ) : !showCalendly ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-8 shadow-lg"
                  >
                    <h3 className="text-2xl font-bree font-bold text-white mb-6">
                      🎉 You're All Set! What's Next?
                    </h3>
                    
                    {/* Primary Action - WhatsApp */}
                    <div className="mb-8">
                      <motion.button
                        onClick={handleWhatsAppRedirect}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg mb-4"
                      >
                        🕋 Join Our WhatsApp Community Now
                      </motion.button>
                      <p className="text-white opacity-70 text-sm">
                        Join 330+ UK Muslim families preparing for Hajj together
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white opacity-20"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-primary text-white opacity-60">Optional</span>
                      </div>
                    </div>

                    {/* Secondary Action - Schedule Call */}
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Want personalised guidance?
                      </h4>
                      <p className="text-white opacity-80 mb-6 text-sm">
                        Schedule a free 30-minute call with our Hajj experts to discuss your specific needs and get personalised recommendations.
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <motion.button
                          onClick={handleScheduleCall}
                          whileHover={{ scale: 1.05 }}
                          className="bg-accent hover:bg-opacity-80 text-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule Free Call
                        </motion.button>
                        
                        <motion.button
                          onClick={handleSkipCall}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                        >
                          Skip for Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Calendly Widget */
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-8 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bree font-bold text-white">
                        Schedule Your Free Consultation
                      </h3>
                      <button
                        onClick={() => setShowCalendly(false)}
                        className="text-white opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg overflow-hidden mb-6">
                      <CalendlyWidget
                        url="https://calendly.com/seerahtours2025/30min"
                        prefillName={submittedData?.fullName}
                        prefillEmail={submittedData?.email}
                        prefillPhone={submittedData?.phone}
                        height="600px"
                      />
                    </div>
                    
                    {/* WhatsApp reminder */}
                    <div className="text-center p-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg">
                      <p className="text-white text-sm mb-3">
                        🕋 Don't forget to join our WhatsApp community for daily tips and updates!
                      </p>
                      <button
                        onClick={handleWhatsAppRedirect}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm flex items-center gap-2 mx-auto"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Join WhatsApp Group
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section - Only show on form page */}
        {!showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bree font-bold text-white mb-4 text-center">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                  {FAQ.map((faq, index) => (
                    <div key={index} className="border-b border-white border-opacity-10 last:border-b-0">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-white hover:bg-opacity-10 transition-colors duration-300 rounded-lg"
                      >
                        <span className="font-semibold text-white">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: openFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-accent" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {openFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 text-white opacity-80">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}