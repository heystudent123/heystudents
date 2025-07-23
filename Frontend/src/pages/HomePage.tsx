import React from 'react';
import Hero from '../components/Hero';
import HostelCarousel from '../components/HostelCarousel';
import FeatureSection from '../components/FeatureSection';
import Testimonials from '../components/Testimonials';
import SharedNavbar from '../components/SharedNavbar';
// Link import removed as it's not used

const HomePage: React.FC = () => {
  // Style for content to add padding for fixed navbar
  const contentStyle: React.CSSProperties = {
    paddingTop: '64px'
  };

  return (
    <div className="min-h-screen w-full" style={{ background: '#fff9ed' }}>
      <SharedNavbar />
      <div style={contentStyle}>
        <Hero className="relative min-h-[70vh] overflow-hidden" />
        <HostelCarousel />
        <FeatureSection />
        <Testimonials />
        
        {/* The Quick Access Section was removed as it was redundant */}
        
        {/* The call-to-action section was removed as requested */}
      </div>
    </div>
  );
};

export default HomePage; 