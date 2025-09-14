import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Seerah Tours Hajj 2026 Community',
  description: 'Terms and conditions for our Hajj 2026 preparation community and WhatsApp group.',
};

export default function TermsAndConditions() {
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
            Terms & Conditions
          </h1>
          
          <div className="text-white space-y-6">
            <p className="text-sm text-accent">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
            
            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By joining our Hajj 2026 preparation community and WhatsApp group, you agree to these Terms & Conditions. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                2. About Our Service
              </h2>
              <p className="leading-relaxed mb-4">
                Seerah Tours provides a FREE community service including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daily Hajj preparation tips via email</li>
                <li>WhatsApp community group for UK Muslims</li>
                <li>Weekly live Q&A sessions with experienced guides</li>
                <li>Comprehensive preparation guides and resources</li>
                <li>Community support from fellow UK Muslim families</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                3. Community Guidelines
              </h2>
              <p className="leading-relaxed mb-4">
                Our community operates according to Islamic principles. Members must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain respectful and beneficial communication</li>
                <li>Keep discussions focused on Hajj preparation and Islamic guidance</li>
                <li>Respect all community members regardless of background</li>
                <li>Avoid sharing inappropriate content or personal information</li>
                <li>Not use the platform for commercial promotion without permission</li>
                <li>Follow the Sunnah in all interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                4. WhatsApp Group Rules
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>No sharing of images without proper Islamic guidelines</li>
                <li>Keep conversations halal and beneficial</li>
                <li>Respect prayer times and avoid excessive messaging during those periods</li>
                <li>Help and support fellow community members</li>
                <li>Report any inappropriate behavior to group administrators</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                5. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                All content provided by Seerah Tours, including guides, tips, and resources, remains our intellectual property. You may use this content for personal Hajj preparation but may not redistribute or use it commercially without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                6. Disclaimer
              </h2>
              <p className="leading-relaxed mb-4">
                While we strive to provide accurate and beneficial guidance:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our service is provided "as is" without warranties</li>
                <li>We encourage you to consult with qualified Islamic scholars</li>
                <li>We are not responsible for individual Hajj booking or travel arrangements</li>
                <li>Always verify information with official Hajj authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                7. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                Seerah Tours provides this service free of charge as a community benefit. We shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                8. Termination
              </h2>
              <p className="leading-relaxed">
                You may stop using our service at any time by unsubscribing from emails and leaving the WhatsApp group. We reserve the right to remove members who violate our community guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                9. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms & Conditions are governed by the laws of England and Wales. Any disputes will be resolved in accordance with UK jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                10. Contact Information
              </h2>
              <p className="leading-relaxed">
                For questions about these Terms & Conditions, contact us:
              </p>
              <p className="mt-2">
                <strong>Seerah Tours</strong><br />
                WhatsApp: +44 7568 340802<br />
                Email: info@seerahtours.co.uk<br />
                Established: 1999 (25+ Years of Hajj Experience)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bree font-bold text-accent mb-3">
                11. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We may update these Terms & Conditions periodically. Continued use of our service after changes constitutes acceptance of the new terms. May Allah bless our community service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}