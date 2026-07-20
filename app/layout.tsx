import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/providers';
import { ToastContainer } from '../components/ui/toast-container';

export const metadata: Metadata = {
  title: 'naaride Admin Control Center',
  description: 'Indian Bike-Taxi Marketplace Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
