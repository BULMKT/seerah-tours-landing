'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Brother Ahmed",
    city: "Manchester",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    quote: "Alhamdulillah, I wish I had this caring community for my first Hajj. The daily guidance and brotherhood is truly invaluable!",
    rating: 5
  },
  {
    name: "Sister Fatima",
    city: "Birmingham", 
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    quote: "Finally, a loving community that truly understands the UK Muslim family experience. May Allah bless this service.",
    rating: 5
  },
  {
    name: "Brother Yusuf",
    city: "London",
    image: "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    quote: "The live Q&As with experts answered questions I didn't even know I had. This community is a true blessing, Alhamdulillah.",
    rating: 5
  },
  {
    name: "Sister Aisha",
    city: "Leeds",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    quote: "The warmth and support from this family made my Hajj preparation so much easier. Barakallahu feeki to the team!",
    rating: 5
  },
  {
    name: "Brother Omar",
    city: "Glasgow",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    quote: "SubhanAllah, the daily tips and community support prepared not just my luggage, but my heart for this sacred journey.",
    rating: 5
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg text-white mb-6 italic leading-relaxed">
            "{testimonials[currentIndex].quote}"
          </p>
          
          <div className="flex justify-center mb-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <span key={i} className="text-accent text-xl">★</span>
            ))}
          </div>
          
          <div className="font-bree font-bold text-white">
            {testimonials[currentIndex].name}
            <span className="text-white opacity-70 font-normal ml-2">
              • {testimonials[currentIndex].city}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevTestimonial}
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-accent hover:text-primary transition-colors duration-300 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-accent w-6' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextTestimonial}
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-accent hover:text-primary transition-colors duration-300 text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}