import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-400/20 blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-secondary-400/20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary-400/30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="relative container-custom pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent-400 rounded-full mr-2 animate-pulse"></span>
              Trusted by 10,000+ DU Students
            </div>
            
            <h1 className="font-display font-bold tracking-tight text-white mb-6">
              <span className="block mb-2">Your Complete</span>
              <span className="text-gradient bg-gradient-to-r from-accent-300 to-secondary-300 bg-clip-text text-transparent">
                DU Companion
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              The ultimate resource for Delhi University students. Find accommodation, connect with alumni, 
              access study resources, discover events, and more — all in one beautifully designed platform.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
              <Link to="/resources" className="btn-accent btn-lg group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Explore Resources
              </Link>
              
              <Link to="/accommodation" className="btn-outline text-white border-white hover:bg-white hover:text-primary-600 btn-lg group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Find Accommodation
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-white/70">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-400 to-secondary-400 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">Join thousands of students</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-accent-300 mr-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm">4.9/5 rating</span>
              </div>
            </div>
          </div>
          
          {/* Hero visual */}
          <div className="w-full lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                  alt="Delhi University Campus"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent"></div>
                
                {/* Stats overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1000+</div>
                      <div className="text-xs text-white/80">Accommodations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">500+</div>
                      <div className="text-xs text-white/80">Alumni</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-xs text-white/80">Colleges</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating feature cards */}
              <div className="absolute -top-6 -right-6 card-glass p-4 max-w-xs animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Verified Listings</div>
                    <div className="text-sm text-neutral-600">100% Safe & Secure</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 card-glass p-4 max-w-xs animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Alumni Network</div>
                    <div className="text-sm text-neutral-600">Connect & Learn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-gentle">
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