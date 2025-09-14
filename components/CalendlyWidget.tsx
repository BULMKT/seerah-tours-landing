'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface CalendlyWidgetProps {
  url: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillPhone?: string;
  height?: string;
}

export default function CalendlyWidget({ 
  url, 
  prefillName, 
  prefillEmail,
  prefillPhone,
  height = '700px' 
}: CalendlyWidgetProps) {
  useEffect(() => {
    // Load Calendly widget when component mounts
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
    script.setAttribute('type', 'text/javascript');
    script.async = true;
    head?.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      head?.removeChild(script);
    };
  }, []);

  // Build the Calendly URL with prefill parameters
  const buildCalendlyUrl = () => {
    const params = new URLSearchParams();
    
    if (prefillName) params.append('name', prefillName);
    if (prefillEmail) params.append('email', prefillEmail);
    if (prefillPhone) params.append('phone', prefillPhone);
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div 
        className="calendly-inline-widget" 
        data-url={buildCalendlyUrl()}
        style={{ minWidth: '320px', height }}
      />
    </>
  );
}