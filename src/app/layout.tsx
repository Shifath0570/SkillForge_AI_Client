import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SkillForge AI – Agentic AI Career Coach & Resume Optimization Platform',
  description: 'Land your dream job with SkillForge AI. Build ATS-friendly resumes, generate cover letters, analyze weaknesses, practice interviews with our AI coach, and track application analytics.',
  keywords: 'ATS resume, career coach, AI career advisor, resume builder, cover letter generator, application tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-slate-100 bg-[#020617]`}>
        <AuthProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
