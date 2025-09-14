'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Target, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const percentage = (current / total) * 100;

  useEffect(() => {
    if (inView) {
      // Animate the counter
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (current - startValue) * progress);
        
        setAnimatedCurrent(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [inView, current]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-accent bg-opacity-20 backdrop-blur-sm border border-accent border-opacity-30 rounded-xl p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-4 -right-4 w-16 h-16 bg-accent bg-opacity-10 rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex justify-between items-center mb-4"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <span className="font-heading font-bold text-white text-lg">{label}</span>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="flex items-center gap-1 bg-accent bg-opacity-20 rounded-full px-3 py-1"
        >
          <motion.span 
            key={animatedCurrent}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-accent font-heading font-bold text-lg"
          >
            {animatedCurrent.toLocaleString()}
          </motion.span>
          <span className="text-white opacity-70">/{total}</span>
        </motion.div>
      </motion.div>
      
      <div className="relative">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
          <motion.div
            className="bg-accent h-4 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={inView ? { width: `${percentage}%` } : { width: 0 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ 
                x: [-100, 300],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: 2.5,
                repeatDelay: 3
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-white to-transparent opacity-30 -skew-x-12"
            />
          </motion.div>
        </div>

        {/* Progress milestones */}
        <div className="flex justify-between text-xs text-white opacity-60 mb-2">
          <span>0</span>
          <span>{(total * 0.25).toFixed(0)}</span>
          <span>{(total * 0.5).toFixed(0)}</span>
          <span>{(total * 0.75).toFixed(0)}</span>
          <span>{total}</span>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-sm text-white opacity-90">Progress</span>
          </div>
          <motion.span 
            key={percentage}
            initial={{ scale: 1.2, color: '#F39C12' }}
            animate={{ scale: 1, color: '#FFFFFF' }}
            className="text-sm font-bold text-accent"
          >
            {percentage.toFixed(1)}%
          </motion.span>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-white opacity-70"
        >
          <Zap className="w-4 h-4" />
          <span>
            {current >= total ? 
              "Alhamdulillah! Community goal achieved 🎉" :
              `${(total - current).toLocaleString()} more needed to reach our goal`
            }
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}