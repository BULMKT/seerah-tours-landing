'use client';
import { useState } from 'react';

export default function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowSuccess(true);
        setEmail('');
        
        // Redirect to WhatsApp after 2 seconds
        setTimeout(() => {
          window.open(data.whatsappLink, '_blank');
        }, 2000);
        
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-accent bg-opacity-90 text-primary p-6 rounded-lg text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-bree font-bold text-lg mb-2">Success! You're in!</p>
          <p className="mb-2">Check your email for next steps</p>
          <p className="text-sm animate-pulse">Redirecting to WhatsApp group...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-lg border-2 border-accent border-opacity-50 bg-white bg-opacity-90 focus:outline-none focus:border-accent focus:bg-opacity-100 text-primary placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent hover:bg-opacity-80 text-primary font-bree font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join the Group'}
        </button>
      </div>
      {error && (
        <p className="text-white opacity-80 text-sm mt-2 text-center">{error}</p>
      )}
    </form>
  );
}