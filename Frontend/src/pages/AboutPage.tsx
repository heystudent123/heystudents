import React from 'react';
import SharedNavbar from '../components/SharedNavbar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />
      
      {/* Header Section */}
      <div className="pt-24 pb-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-black/5 px-4 py-1.5 rounded-full mb-5">
            <span className="text-sm font-medium">About HeyStudents</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Connecting Students to Their Perfect Home</h1>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            We're on a mission to simplify student housing and create communities where students thrive.  
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#fff9ed] border border-neutral-100 shadow-sm rounded-2xl p-8 md:p-10 lg:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-black mb-5">Our Mission</h2>
                <p className="text-neutral-800 mb-4 leading-relaxed">
                  At HeyStudents, we're committed to revolutionizing the way students find their ideal accommodations. We understand the challenges students face when moving to a new city for education, and we're here to make that transition seamless and stress-free.
                </p>
                <p className="text-neutral-800 leading-relaxed">
                  Our platform connects students with verified, quality housing options that match their preferences and budgets, while building a community that supports student success and well-being.  
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden h-72 md:h-80 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                  alt="Students studying together" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-3">Our Values</h2>
          <p className="text-neutral-700 max-w-xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Value 1 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl p-7 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="bg-black/5 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Trust & Safety</h3>
              <p className="text-neutral-600 leading-relaxed">
                We verify all listings to ensure students can trust the accommodations they see on our platform. Your safety and security are our top priorities.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl p-7 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="bg-black/5 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Community</h3>
              <p className="text-neutral-600 leading-relaxed">
                We believe in fostering connections that go beyond housing. Our platform helps students build meaningful communities during their academic journey.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl p-7 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="bg-black/5 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Innovation</h3>
              <p className="text-neutral-600 leading-relaxed">
                We continuously improve our platform with smart matching technology and intuitive features to make finding student accommodations easier than ever.
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Contact CTA Section */}
      <div className="py-16 px-4 md:px-0 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black rounded-2xl p-8 md:p-10 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Get In Touch</h2>
            <p className="text-neutral-300 max-w-xl mx-auto mb-6">
              Have questions about HeyStudents or want to partner with us? We'd love to hear from you!
            </p>
            <a 
              href="mailto:heystudentyt@gmail.com" 
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-xl text-black bg-white hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;