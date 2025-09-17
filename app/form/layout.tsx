import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personalised Hajj Preparation | Seerah Tours',
  description: 'Book a 1-on-1 Hajj planning call. Share your goals, group size, and preferences for a tailor-made experience.',
  keywords: 'Hajj preparation, personalised consultation, Hajj planning, UK Muslims, Seerah Tours',
  openGraph: {
    title: 'Personalised Hajj Preparation | Seerah Tours',
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