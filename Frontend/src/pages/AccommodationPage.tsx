import React from 'react';
import SharedNavbar from '../components/SharedNavbar';
import FixedHostelListingPage from './FixedHostelListingPage';

const AccommodationPage: React.FC = () => {
  // Style for content to add padding for fixed navbar
  const contentStyle: React.CSSProperties = {
    paddingTop: '64px'
  };

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />
      
      {/* Main content */}
      <div style={contentStyle} className="container-custom py-10">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-gray-800 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
            Verified PG & Hostel Listings
          </div>
          
          <h1 className="font-display font-bold tracking-tight text-[#030301] mb-4">
            <span className="block text-3xl md:text-4xl lg:text-5xl">Find Your Perfect Accommodation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#030301] mb-8 leading-relaxed">
            Browse our curated collection of verified PGs and hostels near your campus
          </p>
        </div>
        
        <div className="bg-[#fff9ed] rounded-2xl p-6 shadow-sm border border-neutral-100">
          <FixedHostelListingPage />
        </div>
      </div>
    </div>
  );
};
export default AccommodationPage;