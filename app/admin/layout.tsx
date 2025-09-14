import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Seerah Tours',
  description: 'Admin dashboard for managing form submissions and resources.',
  robots: 'noindex, nofollow', // Keep admin pages private
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}