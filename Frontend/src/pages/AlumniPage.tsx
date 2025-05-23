import React, { useState, useEffect } from 'react';
import AlumniSection from '../components/AlumniSection';

const AlumniPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    referralCode: ''
  });

  useEffect(() => {
    // Check if user info exists in localStorage
    const userInfo = localStorage.getItem('userInfo');
    // Only show the alumni form if the user hasn't submitted the main welcome form
    setShowModal(!userInfo);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary"> {/* Extended background to cover navbar */}
      <div className="pt-16"> {/* Added padding-top to account for fixed navbar */}
      {/* Welcome Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-dark/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center animate-fade-in">
          <div className="relative bg-white rounded-2xl shadow-card max-w-md w-full mx-4 animate-slide-up">
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-neutral-dark">Join Alumni Network</h2>
                <p className="text-gray-500 mt-2">Please provide your details to connect with alumni</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="referralCode" className="label">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="referralCode"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter referral code if you have one"
                  />
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                  >
                    Join Network
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By joining, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-secondary-light/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary-light/20 blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in">
              <h1 className="font-display font-bold tracking-tight text-white">
                <span className="block mb-2">Connect with</span>
                <span className="text-accent">Your Alumni Network</span>
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0">
                Discover where your college alumni are now, connect with them for mentorship, and expand your professional network with graduates who've been in your shoes.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button onClick={() => setShowModal(true)} className="btn-accent text-base md:text-lg py-3 px-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Join Network
                </button>
                
                <a href="#alumni-section" className="btn-outline text-white border-white hover:bg-white/10 text-base md:text-lg py-3 px-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Browse Alumni
                </a>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8">
                <div className="flex items-center">
                  <div className="text-accent mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3.707 5.293a1 1 0 00-1.414 1.414L8 10.586l7.707-7.293a1 1 0 111.414 1.414l-8 8a1 1 0 01-1.414 0l-7.293-7.293a1 1 0 013.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">500+ Alumni</span>
                </div>
                <div className="flex items-center">
                  <div className="text-accent mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3.707 5.293a1 1 0 00-1.414 1.414L8 10.586l7.707-7.293a1 1 0 111.414 1.414l-8 8a1 1 0 01-1.414 0l-7.293-7.293a1 1 0 013.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">50+ Colleges</span>
                </div>
                <div className="flex items-center">
                  <div className="text-accent mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3.707 5.293a1 1 0 00-1.414 1.414L8 10.586l7.707-7.293a1 1 0 111.414 1.414l-8 8a1 1 0 01-1.414 0l-7.293-7.293a1 1 0 013.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Free Mentorship</span>
                </div>
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
                    src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                    alt="Delhi University Alumni"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white">Alumni Success Stories</h3>
                    <p className="text-white/80 mt-2">Learn from graduates who've made it big in their fields</p>
                  </div>
                </div>
              </div>
              
              {/* Floating testimonial */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-card p-4 max-w-xs">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/12.jpg" 
                    alt="Alumni Testimonial" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <div className="flex text-accent mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-neutral-dark">"The alumni network helped me land my dream job at Google!"</p>
                    <p className="text-xs text-gray-500 mt-1">Priya Sharma, St. Stephen's College</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="alumni-section" className="bg-neutral py-20">
        <AlumniSection />
      </div>
      
      {/* CTA Section */}
      <div className="relative bg-neutral-dark overflow-hidden mb-32">
        {/* Top wave decoration */}
        <div className="w-full overflow-hidden">
          <svg className="w-full h-12 text-neutral" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to connect with alumni?</span>
                <span className="block text-accent">Start networking today.</span>
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Join our alumni network to get mentorship, career guidance, and networking opportunities with graduates from Delhi University.  
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 gap-4">
              <button onClick={() => setShowModal(true)} className="btn-accent text-base py-3 px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Join Network
              </button>
              <a href="#alumni-section" className="btn-outline text-white border-white hover:bg-white/10 text-base py-3 px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AlumniPage;