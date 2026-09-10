import type { Metadata } from 'next';
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Prompt Quest — Generate your ChatGPT prompt and HTML code',
  description:
    'Fill in Goal, Input, Layout, Features, and Output to create your first app prompt for ChatGPT, then download an HTML starter.',
};

const pixel = Press_Start_2P({
  variable: '--font-pixel',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
