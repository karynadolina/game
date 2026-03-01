import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Who Wants to Be a Millionaire?',
  description: 'Test your knowledge and win virtual millions!',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
