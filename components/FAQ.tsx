'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is this service really free?",
    answer: "Yes, completely free, Alhamdulillah. No hidden costs ever. This is our way of serving the Muslim community and helping families prepare for this blessed journey."
  },
  {
    question: "Who runs this beautiful community?",
    answer: "Seerah Tours - Alhamdulillah we've been serving UK Muslim families for 25+ years. Our team includes knowledgeable scholars and experienced Hajj guides who care deeply about your journey."
  },
  {
    question: "What happens after I join this family?",
    answer: "You'll get daily blessed guidance, join weekly live sessions with caring experts, access comprehensive resources, and become part of our loving community of 330+ families, In Sha Allah."
  },
  {
    question: "How often do you share guidance?",
    answer: "Daily beneficial tips every morning at 9am, weekly live Q&A sessions with experts, and regular helpful updates about Hajj preparation throughout the year, Alhamdulillah."
  },
  {
    question: "Can I leave if needed?",
    answer: "Of course, you're always free to leave the WhatsApp group anytime, no questions asked. Though we pray you'll stay and benefit from this blessed community, the choice is always yours."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white hover:bg-opacity-20 transition-colors duration-300"
            >
              <span className="font-bree font-bold text-white pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-accent" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-white opacity-80 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}