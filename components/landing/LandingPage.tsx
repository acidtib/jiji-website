'use client';

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServerRolloutSection } from './components/ServerRolloutSection';
import { DashboardShowcase } from './components/DashboardShowcase';
import { EcosystemSection } from './components/EcosystemSection';
import { FeatureGrid } from './components/FeatureGrid';
import { QuickStart } from './components/QuickStart';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export default function LandingPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="jiji-landing min-h-screen bg-[#070907] text-zinc-100 flex flex-col font-sans selection:bg-lime-400 selection:text-black">
      {/* Navigation Header */}
      <Navbar onShowToast={showToast} />

      {/* Main Page Layout */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onShowToast={showToast} />

        {/* Section 2: Deploy on your servers. Roll out safely. */}
        <ServerRolloutSection />

        {/* Section 3: Four Hosts, One Private Network (Interactive Dashboard) */}
        <DashboardShowcase onShowToast={showToast} />

        {/* Section 4: Where JIJI Fits */}
        <EcosystemSection />

        {/* Section 5 & 6: From Config to Healthy Containers + Tools Grid */}
        <FeatureGrid />

        {/* Section 7: What Teams Ask Before Deploying (FAQ) */}
        <FaqSection />

        {/* Section 8: Call To Action (Your Next Deploy Can Be Boring) */}
        <QuickStart onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
