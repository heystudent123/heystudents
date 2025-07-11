import React from 'react';
import SharedNavbar from '../components/SharedNavbar';

const AboutPage: React.FC = () => {
  // Style for content to add padding for fixed navbar
  const contentStyle: React.CSSProperties = {
    paddingTop: '64px'
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <SharedNavbar />
      
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-20 shadow-lg relative overflow-hidden" style={contentStyle}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">About Hey Students</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Your trusted platform for finding the perfect PG near Delhi University
          </p>
        </div>
      </div>
      
      <div className="bg-neutral-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100/50 transform transition-all duration-300 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white mb-6 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">Our Mission</h2>
                <p className="text-neutral-600 mb-4">
                  At Hey Students, our mission is to simplify the PG search process for Delhi University students. 
                  We understand the challenges of finding suitable accommodation near campus, and we're here to make that journey easier.
                </p>
                <p className="text-neutral-600 mb-4">
                  We believe that every student deserves a safe, comfortable, and affordable place to stay during their 
                  academic journey. Through our platform, we aim to connect students with PG owners and help them find 
                  accommodation that meets their specific needs and preferences.
                </p>
                <p className="text-neutral-600">
                  Our goal is to become the go-to resource for all DU students looking for PGs, ensuring they have 
                  access to comprehensive information, verified reviews, and direct contact with property owners.
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/40 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Delhi University Campus" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
          </div>

          </div>
          
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-10">
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">How It Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100/50 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-primary-600 mb-3">Search & Filter</h3>
                <p className="text-neutral-600">
                  Use our powerful search filters to find PGs based on location, price, 
                  facilities, mess type, and distance to college and metro stations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100/50 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-primary-600 mb-3">Browse & Compare</h3>
                <p className="text-neutral-600">
                  View detailed information about each PG, including photos, amenities, 
                  pricing, and student reviews to make informed decisions.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100/50 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-primary-600 mb-3">Contact & Visit</h3>
                <p className="text-neutral-600">
                  Directly contact PG owners through our platform to ask questions, 
                  schedule visits, and secure your ideal accommodation.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-10">
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Our Team</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-100/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative mx-auto h-36 w-36 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="Team Member"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-1">Vikram Mehta</h3>
                <p className="text-primary-600 font-medium mb-3">Founder & CEO</p>
                <p className="text-neutral-500 text-sm">Passionate about creating solutions that make student life easier.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-100/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative mx-auto h-36 w-36 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="Team Member"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-1">Aisha Patel</h3>
                <p className="text-primary-600 font-medium mb-3">Operations Manager</p>
                <p className="text-neutral-500 text-sm">Ensuring smooth operations and exceptional user experiences.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-100/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative mx-auto h-36 w-36 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="Team Member"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-1">Rahul Sharma</h3>
                <p className="text-primary-600 font-medium mb-3">Technical Lead</p>
                <p className="text-neutral-500 text-sm">Building innovative solutions with cutting-edge technologies.</p>
              </div>
            </div>
          </div>

          <div className="mt-24 mb-16">
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-10 px-8 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                
                <h2 className="text-3xl font-bold text-white mb-2 text-center relative z-10">Contact Us</h2>
                <p className="text-center text-white/80 mb-0 relative z-10">
                  Have questions or feedback? We'd love to hear from you!
                </p>
              </div>
              
              <div className="p-8">
                <div className="max-w-lg mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="bg-neutral-50/50 p-6 rounded-xl hover:bg-neutral-50 transition-colors duration-300 transform hover:scale-105">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Email</h3>
                      <p className="text-neutral-600">info@duflatfinder.com</p>
                    </div>
                    <div className="bg-neutral-50/50 p-6 rounded-xl hover:bg-neutral-50 transition-colors duration-300 transform hover:scale-105">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Phone</h3>
                      <p className="text-neutral-600">+91 9876543210</p>
                    </div>
                    <div className="bg-neutral-50/50 p-6 rounded-xl hover:bg-neutral-50 transition-colors duration-300 transform hover:scale-105">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Address</h3>
                      <p className="text-neutral-600">123 University Road, North Campus, Delhi - 110007</p>
                    </div>
                    <div className="bg-neutral-50/50 p-6 rounded-xl hover:bg-neutral-50 transition-colors duration-300 transform hover:scale-105">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Office Hours</h3>
                      <p className="text-neutral-600">Monday - Friday: 9am - 6pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with gradient */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 py-8 text-white/80 text-center">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Hey Students. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;