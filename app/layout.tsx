import './globals.css';
import type { Metadata } from 'next';
import { Inter, Bree_Serif } from 'next/font/google';
import Script from 'next/script';
import MobileNavigation from '@/components/MobileNavigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const breeSerif = Bree_Serif({ 
  weight: '400',
  subsets: ['latin'], 
  variable: '--font-bree' 
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seerahtours.netlify.app'),
  title: 'Join 250+ UK Muslims Preparing for Hajj 2026 | Seerah Tours',
  description: 'Get FREE daily tips, live guidance, and join a supportive community of UK Muslims preparing for Hajj 2026 together.',
  keywords: 'Hajj 2026, UK Muslims, Hajj preparation, WhatsApp group, Seerah Tours',
  openGraph: {
    title: 'Join 250+ UK Muslims Preparing for Hajj 2026',
    description: 'Get FREE daily tips, live guidance, and join a supportive community preparing for Hajj 2026.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 0.85,
  maximumScale: 1.0,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=0.85, maximum-scale=1.0, user-scalable=yes" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${breeSerif.variable}`}>
        <MobileNavigation />
        {children}
      </body>
    </html>
  );
}