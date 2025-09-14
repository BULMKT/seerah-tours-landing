import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Seerah Tours Hajj 2026 Community',
  description: 'Privacy policy for our Hajj 2026 preparation community and WhatsApp group.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center text-accent hover:text-white transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bree font-bold text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="text-white space-y-6">
            <p className="text-sm text-accent">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
            
            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                1. Information We Collect
              </h2>
              <p className="leading-relaxed mb-4">
                When you join our Hajj 2026 preparation community, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address for sending daily tips and updates</li>
                <li>WhatsApp phone number when you join our group</li>
                <li>Any information you voluntarily share in our community discussions</li>
                <li>Basic usage analytics to improve our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send you daily Hajj preparation tips and guidance</li>
                <li>Provide access to our WhatsApp community group</li>
                <li>Send important updates about Hajj 2026 preparations</li>
                <li>Improve our community services and content</li>
                <li>Respond to your questions and provide support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                3. Information Sharing
              </h2>
              <p className="leading-relaxed mb-4">
                We respect your privacy and do not sell, trade, or rent your information to third parties. We may share information only:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>When required by law or legal process</li>
                <li>With your explicit consent</li>
                <li>To protect our rights, property, or safety</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                4. WhatsApp Group Guidelines
              </h2>
              <p className="leading-relaxed mb-4">
                Our WhatsApp community operates under Islamic principles:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain respectful and beneficial discussions</li>
                <li>Keep conversations focused on Hajj preparation</li>
                <li>Respect other members' privacy and personal information</li>
                <li>No sharing of personal information without consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                5. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                6. Your Rights
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unsubscribe from our emails at any time</li>
                <li>Leave the WhatsApp group whenever you choose</li>
                <li>Request a copy of your personal data</li>
                <li>Request deletion of your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                7. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Seerah Tours</strong><br />
                WhatsApp: +44 7568 340802<br />
                Email: info@seerahtours.co.uk
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                8. Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}