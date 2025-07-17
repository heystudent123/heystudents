import React from 'react';
import SharedNavbar from '../components/SharedNavbar';
import FixedHostelListingPage from './FixedHostelListingPage';

const AccommodationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff9ed]">
      {/* Use the SharedNavbar component for consistency */}
      <SharedNavbar />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-2">Find Your Perfect Accommodation</h1>
          <p className="text-neutral-600 text-base md:text-lg">
            Searching For All Hostels in All Locations
          </p>
        </div>
        
        <div>
          <FixedHostelListingPage />
        </div>
      </div>
    </div>
  );
};


export default AccommodationPage;
