import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hajj Tips, Webinars & Guides | Seerah Tours Resource Center',
  description: 'Explore daily Hajj tips, watch past webinars, and download practical PDFs to prepare with confidence.',
  keywords: 'Hajj resources, Hajj tips, Hajj webinars, Hajj guides, PDF downloads, Hajj preparation',
  openGraph: {
    title: 'Hajj Tips, Webinars & Guides | Seerah Tours Resource Center',
    description: 'Explore daily Hajj tips, watch past webinars, and download practical PDFs to prepare with confidence.',
    type: 'website',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}