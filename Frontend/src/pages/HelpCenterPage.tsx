import React from 'react';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="bg-neutral-50">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
            <p className="text-xl opacity-90 mb-8">
              Find answers to common questions and learn how to make the most of Hey Students
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full px-6 py-4 rounded-xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <svg className="w-full h-12 text-neutral-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Help Topics</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#account" className="flex items-center text-primary-600 font-medium p-2 bg-primary-50 rounded-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account & Profile
                  </a>
                </li>
                <li>
                  <a href="#accommodation" className="flex items-center text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Accommodation
                  </a>
                </li>
                <li>
                  <a href="#payments" className="flex items-center text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payments & Billing
                  </a>
                </li>
                <li>
                  <a href="#security" className="flex items-center text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Security & Privacy
                  </a>
                </li>
                <li>
                  <a href="#technical" className="flex items-center text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Technical Issues
                  </a>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-primary-50 rounded-xl">
                <h4 className="font-semibold text-neutral-800 mb-2">Need more help?</h4>
                <p className="text-neutral-600 text-sm mb-3">
                  Can't find what you're looking for? Contact our support team directly.
                </p>
                <a href="/contact" className="btn-primary w-full text-center">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            <div id="account" className="bg-white rounded-2xl shadow-soft p-6 mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Account & Profile</h2>
              
              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-5">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">How do I create an account?</h3>
                  <p className="text-neutral-600">
                    To create an account, click on the "Sign Up" button in the top right corner of the homepage. 
                    Fill in your details including name, email, and password. Verify your email address through 
                    the confirmation link sent to your inbox, and you're all set!
                  </p>
                </div>
                
                <div className="border-b border-neutral-200 pb-5">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">How do I update my profile information?</h3>
                  <p className="text-neutral-600">
                    After logging in, click on your profile icon in the top right corner and select "Profile Settings." 
                    Here you can update your personal information, change your password, and manage notification preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">I forgot my password. How do I reset it?</h3>
                  <p className="text-neutral-600">
                    On the login page, click "Forgot Password?" and enter the email address associated with your account. 
                    We'll send you a password reset link. Follow the instructions in the email to create a new password.
                  </p>
                </div>
              </div>
            </div>
            
            <div id="accommodation" className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Accommodation</h2>
              
              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-5">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">How do I search for accommodation?</h3>
                  <p className="text-neutral-600">
                    Use our search filters on the Accommodation page to find PGs based on location, price range, 
                    amenities, and distance from campus. You can sort results by price, ratings, or distance.
                  </p>
                </div>
                
                <div className="border-b border-neutral-200 pb-5">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">How do I contact PG owners?</h3>
                  <p className="text-neutral-600">
                    When viewing a PG listing, you'll find contact information or a "Contact Owner" button. 
                    Click this to send a message directly to the owner through our platform. Your contact 
                    details will only be shared once you initiate communication.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">Are the listings verified?</h3>
                  <p className="text-neutral-600">
                    We strive to verify all listings on our platform. Listings marked with a "Verified" badge 
                    have been physically checked by our team. However, we always recommend visiting the 
                    accommodation in person before making any payments or commitments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
