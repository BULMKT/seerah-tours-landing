'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Heart } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Hajj 2026 estimated date (June 28, 2026)
    const hajjDate = new Date('2026-06-28T00:00:00Z').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = hajjDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-white bg-opacity-20 rounded mb-6 max-w-xs mx-auto"></div>
          <div className="bg-accent bg-opacity-90 rounded-xl p-8 max-w-lg mx-auto">
            <div className="h-16 bg-primary bg-opacity-20 rounded mb-4"></div>
            <div className="h-6 bg-primary bg-opacity-20 rounded max-w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: Calendar },
    { label: 'Hours', value: timeLeft.hours, icon: Clock },
    { label: 'Minutes', value: timeLeft.minutes, icon: Clock },
    { label: 'Seconds', value: timeLeft.seconds, icon: Clock }
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-accent" />
          <h3 className="text-2xl font-heading font-bold text-white">
            Time Until Hajj 2026
          </h3>
          <Heart className="w-6 h-6 text-accent" />
        </div>
        <p className="text-white opacity-70 text-sm">
          In Sha Allah, the blessed journey awaits
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-accent rounded-xl p-6 max-w-lg mx-auto shadow-2xl border-2 border-white border-opacity-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeUnits.map((unit, index) => {
            const IconComponent = unit.icon;
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  animate={unit.label === 'Seconds' ? { 
                    scale: [1, 1.05, 1] 
                  } : {}}
                  transition={{ 
                    duration: 1,
                    repeat: unit.label === 'Seconds' ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="mb-2"
                >
                  <div className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1">
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <IconComponent className="w-3 h-3 text-primary opacity-70" />
                    <span className="text-xs font-semibold text-primary opacity-80">
                      {unit.label}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-4 pt-4 border-t border-primary border-opacity-20"
        >
          <p className="text-primary font-semibold text-sm">
            🕋 {timeLeft.days.toLocaleString()} days of preparation ahead
          </p>
          <motion.p 
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-primary text-xs mt-1 opacity-80"
          >
            May Allah accept our journey • Ameen
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}