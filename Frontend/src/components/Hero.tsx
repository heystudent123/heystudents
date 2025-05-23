import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-secondary-light/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary-light/20 blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 lg:pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in">
            <h1 className="font-display font-bold tracking-tight text-white">
              <span className="block mb-2">Your Complete</span>
              <span className="text-accent">DU Companion</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0">
              The ultimate resource for Delhi University students. Find accommodation, connect with alumni, 
              access study resources, discover events, and more - all in one place.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/resources" className="btn-accent text-base md:text-lg py-3 px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Explore Resources
              </Link>
              
              <Link to="/accommodation" className="btn-outline text-white border-white hover:bg-white/10 text-base md:text-lg py-3 px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Find Accommodation
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start">
              <span className="text-white/70 text-sm">Already a member?</span>
              <Link to="/login" className="ml-2 text-accent hover:text-accent-light font-medium text-sm">Log in</Link>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="w-full lg:w-1/2 relative animate-slide-up">
            <div className="relative">
              {/* Image frame */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent to-secondary blur-sm"></div>
              
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl shadow-card">
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                  alt="Delhi University Campus"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent"></div>
                
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between">
                  <div className="text-white">
                    <p className="text-2xl font-bold">1000+</p>
                    <p className="text-sm text-white/80">Accommodations</p>
                  </div>
                  <div className="text-white">
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-white/80">Alumni</p>
                  </div>
                  <div className="text-white">
                    <p className="text-2xl font-bold">50+</p>
                    <p className="text-sm text-white/80">Colleges</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card p-3 flex items-center">
              <div className="bg-success/10 text-success rounded-lg p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-dark">Verified Listings</p>
                <p className="text-xs text-gray-500">Safe & Secure</p>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card p-3 flex items-center">
              <div className="bg-info/10 text-info rounded-lg p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-dark">Alumni Network</p>
                <p className="text-xs text-gray-500">Connect & Learn</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;