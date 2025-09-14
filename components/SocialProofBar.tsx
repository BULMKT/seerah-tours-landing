'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, TrendingUp } from 'lucide-react';

export default function SocialProofBar() {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { icon: Users, text: "330+ active members, Alhamdulillah" },
    { icon: MapPin, text: "Brothers & sisters from 20+ UK cities" },
    { icon: TrendingUp, text: "35 new family members this week" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [stats.length]);

  return (
    <div className="bg-accent py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-primary">🕋</span>
          <span className="font-bree text-sm sm:text-base text-primary font-bold">
            {stats[currentStat].text}
          </span>
        </div>
      </div>
    </div>
  );
}