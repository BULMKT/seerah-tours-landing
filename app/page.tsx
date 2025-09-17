'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, Users, Calendar, BookOpen, MessageSquare, Heart, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import SocialProofBar from '@/components/SocialProofBar';
import ProgressBar from '@/components/ProgressBar';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import FAQ from '@/components/FAQ';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ems_copy_t';

const benefits = [
  {
    icon: Calendar,
    title: "Daily Hajj preparation tips at 9am",
    description: "Start each blessed day with helpful guidance, In Sha Allah"
  },
  {
    icon: BookOpen,
    title: "Weekly live Q&A with experienced Hajj guides",
    description: "25+ years of experience helping families like yours"
  },
  {
    icon: Heart,
    title: "FREE comprehensive Hajj preparation guides",
    description: "Everything you need for this blessed journey"
  },
  {
    icon: Users,
    title: "Connect with fellow UK Muslim families",
    description: "Build lasting bonds with your brothers and sisters"
  },
  {
    icon: MessageSquare,
    title: "Complete step-by-step preparation roadmap",
    description: "Never feel lost - we'll guide you every step"
  },
  {
    icon: Clock,
    title: "Budgeting and cost planning guidance",
    description: "Plan your finances wisely for this sacred journey"
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Join our family",
    description: "Enter your email to become part of our community",
    icon: "📧"
  },
  {
    step: 2,
    title: "Check your inbox",
    description: "Receive your welcome guide with duas and blessings",
    icon: "📨"
  },
  {
    step: 3,
    title: "Join our WhatsApp family",
    description: "Begin receiving daily guidance and support",
    icon: "💬"
  },
];

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const handleJoinGroup = () => {
    window.open(WHATSAPP_GROUP_LINK, '_blank');
    
    // Track WhatsApp group join
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'WhatsApp Group',
        event_label: 'Main CTA'
      });
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <SocialProofBar />
      
      {/* Navigation Bar */}
      <nav className="bg-primary bg-opacity-90 backdrop-blur-sm border-b border-white border-opacity-10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/seerah logo.png"
                alt="Seerah Tours"
                width={120}
                height={48}
                className="opacity-80"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/form"
                className="text-white hover:text-accent transition-colors duration-300 font-semibold"
              >
                Personalised Experience
              </Link>
              <Link 
                href="/resources"
                className="text-white hover:text-accent transition-colors duration-300 font-semibold"
              >
                Resources
              </Link>
              <button
                onClick={handleJoinGroup}
                className="btn-primary"
              >
                Join WhatsApp Group
              </button>
            </div>
            {/* Mobile menu */}
            <div className="md:hidden">
              <button
                onClick={handleJoinGroup}
                className="btn-primary text-sm py-2 px-4"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative bg-primary py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: 'url("/hajj-hero-2.jpg")'
          }}
        />
        <div className="absolute inset-0 bg-primary bg-opacity-60" />
        
        <div className="container mx-auto px-4">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              {/* Logo */}
              <div className="mb-8">
                <Image
                  src="/seerah logo.png"
                  alt="Seerah Tours"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bree font-bold text-center mb-6 text-white">
                Join{' '}
                <span className="text-accent font-bree">330+</span>{' '}
                <span className="text-white">UK Muslim Families</span><br />
                Preparing for{' '}
                <span className="text-accent font-bree">Hajj 2026</span>{' '}
                <span className="text-white">Together</span>
              </h1>
              
              <p className="text-xl text-center mb-8 text-white">
                Assalamu Alaikum! Join our <strong className="text-accent font-bree">FREE</strong> WhatsApp group for daily guidance, expert support, and a caring Muslim community
              </p>
              
              {/* Direct WhatsApp Join */}
              <div className="max-w-md mx-auto">
                <motion.button
                  onClick={handleJoinGroup}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-accent hover:bg-opacity-80 text-primary font-bree font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                >
                  🕋 Join Our WhatsApp Group - FREE
                </motion.button>
                <p className="text-white opacity-80 text-sm mt-3 text-center">
                  Click to join 330+ UK Muslim families preparing together
                </p>
              </div>
              
              {/* Social Proof */}
              <div className="text-center mt-8">
                <p className="text-sm text-white opacity-80">
                  🕋 Alhamdulillah, 35 new family members this week | 📍 Brothers & sisters from 20+ UK cities
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <CountdownTimer />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/sj_episode_hajj.jpg"
                alt="Hajj pilgrims at Kaaba"
                className="rounded-lg shadow-lg object-cover h-32"
              />
              <img
                src="/GettyImages-1258944293-e1687694893696.jpg"
                alt="Hajj preparation"
                className="rounded-lg shadow-lg object-cover h-32"
              />
              <img
                src="/The_Hajj_kicks_into_full_gear_-_Flickr_-_Al_Jazeera_English_(8).jpg"
                alt="Islamic prayer"
                className="rounded-lg shadow-lg object-cover h-32"
              />
              <img
                src="/hajj.jpg"
                alt="Hajj journey"
                className="rounded-lg shadow-lg object-cover h-32"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-12 px-4 bg-primary">
        <div className="container mx-auto max-w-2xl">
          <ProgressBar current={330} total={500} label="Community Members" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              Why Join Our WhatsApp Community?
            </h2>
            <p className="text-xl text-white opacity-80 max-w-3xl mx-auto">
              Join 330+ UK Muslims who are already preparing for the journey of a lifetime
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent bg-opacity-90 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bree font-bold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-white opacity-80">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-white opacity-80">
              Join our community in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-accent bg-opacity-90 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">
                  {step.icon}
                </div>
                <div className="bg-accent bg-opacity-90 text-primary rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 font-bree font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bree font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white opacity-80">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hajj Photo Gallery */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              Beautiful Moments from Hajj Journeys
            </h2>
            <p className="text-xl text-white opacity-80">
              Sacred memories from our community families, Alhamdulillah
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: [0, -100, -200, -300, -200, -100, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[
                "/4d6306da-9688-43c1-8738-3877b387c27c.JPG",
                "/0fd00d2b-9cce-42f2-8237-5314282003a0.JPG",
                "/1b68af46-6b65-4504-8492-cc78ad6b4968.JPG",
                "/6be70e61-198e-43e3-9136-5f2c7e7720e5.JPG",
                "/021d9c33-5e48-4d83-8959-7be7df65ffdc.JPG",
                "/4d6306da-9688-43c1-8738-3877b387c27c.JPG",
                "/0fd00d2b-9cce-42f2-8237-5314282003a0.JPG",
                "/1b68af46-6b65-4504-8492-cc78ad6b4968.JPG"
              ].map((src, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Sacred Hajj journey ${index + 1}`}
                    className="w-80 h-60 object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              Stories from Our Community Family
            </h2>
            <p className="text-xl text-white opacity-80">
              Hear heartfelt experiences from your brothers and sisters
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                name: "Brother Ali", 
                city: "Manchester", 
                message: "This community helped me prepare my heart for Hajj",
                video: "/1e19df97-d63e-4f2e-bdf3-70e691b3f754.MP4"
              },
              { 
                name: "Brother Omar", 
                city: "London", 
                message: "Alhamdulillah, the daily tips were invaluable",
                video: "/fe110d2c-1622-4c12-8a54-4b54551f478b.MP4"
              },
              { 
                name: "Brother Saleem`", 
                city: "Leeds", 
                message: "I felt so supported throughout my preparation",
                video: "/6f7649c2-fe68-4e18-8140-84fb2ca5537a.MP4"
              }
            ].map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 shadow-lg"
              >
                <div className="relative">
                  <video
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    controls
                    preload="metadata"
                    playsInline
                    webkit-playsinline="true"
                  >
                    <source src={person.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <h3 className="font-bree font-bold text-white mb-2">{person.name}</h3>
                <p className="text-accent text-sm mb-2">{person.city}</p>
                <p className="text-white opacity-80 text-sm">"{person.message}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Written Testimonials */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              Heartfelt Words from Our Family
            </h2>
            <p className="text-xl text-white opacity-80">
              Genuine experiences from your brothers and sisters, Alhamdulillah
            </p>
          </motion.div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              Questions from Our Community Family
            </h2>
            <p className="text-xl text-white opacity-80">
              Common questions from brothers and sisters like yourself
            </p>
          </motion.div>

          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bree font-bold text-white mb-6">
              Ready to Begin This Blessed Journey?
            </h2>
            <p className="text-xl text-white opacity-80 mb-12 max-w-2xl mx-auto">
              Join 330+ UK Muslim families who are preparing together with love and support. You don't have to do this alone - let our caring community be with you every step of this blessed journey, In Sha Allah.
            </p>
            
            <div className="max-w-md mx-auto">
              <motion.button
                onClick={handleJoinGroup}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-accent hover:bg-opacity-80 text-primary font-bree font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                🕋 Join Our WhatsApp Group - FREE
              </motion.button>
            </div>
            
            <p className="text-white opacity-60 text-sm mt-6">
              🕋 Alhamdulillah, trusted by Muslim families across 20+ UK cities 🕋
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4 border-t border-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="mb-4">
              <Image
                src="/seerah logo.png"
                alt="Seerah Tours"
                width={150}
                height={60}
                className="mx-auto"
              />
            </div>
            <p className="text-blue-200 font-body text-lg">25 Years of Hajj Experience</p>
          </div>
          
          <div className="border-t border-accent border-opacity-30 pt-8">
            <div className="flex justify-center space-x-6 mb-4 text-sm">
              <Link href="/privacy" className="text-white opacity-60 hover:opacity-100 transition-opacity duration-300">
                Privacy Policy
              </Link>
              <span className="text-white opacity-30">|</span>
              <Link href="/terms" className="text-white opacity-60 hover:opacity-100 transition-opacity duration-300">
                Terms & Conditions
              </Link>
            </div>
            <p className="text-white opacity-60 text-sm">
              © 2024 Seerah Tours. All rights reserved. | Alhamdulillah, serving UK Muslim families since 1999
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Kaaba Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <motion.div
          animate={{
            x: [0, 100, 200, 300, 200, 100, 0],
            y: [0, -50, -100, -50, 0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-0 text-2xl opacity-20"
        >
          🕋
        </motion.div>
        <motion.div
          animate={{
            x: [windowWidth, 1000, 800, 600, 800, 1000, windowWidth],
            y: [100, 50, 150, 100, 200, 150, 100],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className="absolute top-1/2 right-0 text-xl opacity-15"
        >
          🕋
        </motion.div>
      </div>
      {/* Interactive Elements */}
      <ExitIntentPopup />
      <FloatingWhatsApp />
    </div>
  );
}