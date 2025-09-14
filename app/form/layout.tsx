import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personalized Hajj Preparation | Seerah Tours',
  description: 'Book a 1-on-1 Hajj planning call. Share your goals, group size, and preferences for a tailor-made experience.',
  keywords: 'Hajj preparation, personalized consultation, Hajj planning, UK Muslims, Seerah Tours',
  openGraph: {
    title: 'Personalized Hajj Preparation | Seerah Tours',
    description: 'Book a 1-on-1 Hajj planning call. Share your goals, group size, and preferences for a tailor-made experience.',
    type: 'website',
  },
};

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}