'use client';

import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WhatsAppFloatingButton } from '../components/layout/WhatsAppButton';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { CoursesSection } from '../components/sections/Courses';
import { Methodology } from '../components/sections/Methodology';
import { Testimonials } from '../components/sections/Testimonials';
import { BlogSection } from '../components/sections/Blog';
import { FAQSection } from '../components/sections/FAQ';
import { ContactSection } from '../components/sections/Contact';

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
