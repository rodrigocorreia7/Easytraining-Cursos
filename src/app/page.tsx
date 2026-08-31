'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WhatsAppFloatingButton } from '../components/layout/WhatsAppButton';
import { Hero } from '../components/sections/Hero';
import { Methodology } from '../components/sections/Methodology';
import { CoursesSection } from '../components/sections/Courses';

// Dynamic imports for below-the-fold components to reduce initial JS payload on Mobile
const About = dynamic(() => import('../components/sections/About').then(m => m.About), {
  ssr: true,
  loading: () => <div className="min-h-[500px] bg-slate-900 animate-pulse" />
});

const Testimonials = dynamic(() => import('../components/sections/Testimonials').then(m => m.Testimonials), {
  ssr: true,
  loading: () => <div className="min-h-[400px] bg-slate-50 animate-pulse" />
});

const BlogSection = dynamic(() => import('../components/sections/Blog').then(m => m.BlogSection), {
  ssr: true,
  loading: () => <div className="min-h-[400px] bg-white animate-pulse" />
});

const FAQSection = dynamic(() => import('../components/sections/FAQ').then(m => m.FAQSection), {
  ssr: true,
  loading: () => <div className="min-h-[400px] bg-slate-50 animate-pulse" />
});

const ContactSection = dynamic(() => import('../components/sections/Contact').then(m => m.ContactSection), {
  ssr: true,
  loading: () => <div className="min-h-[500px] bg-white animate-pulse" />
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#00B060] selection:text-white font-sans antialiased">
      <Header />
      
      <main id="main-content">
        <Hero />
        <Methodology />
        <CoursesSection />
        <About />
        <Testimonials />
        <BlogSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
