import React from 'react';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeatureSection />
      
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
              For Students, By Students
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of Delhi University students who use Hey Students to enhance their university experience.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-primary">Aarav Sharma</h3>
                    <p className="text-sm text-gray-500">Hansraj College, 3rd Year</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "This platform has been a game-changer for me. From finding study materials to connecting with seniors who guided my career path - it's truly the ultimate DU companion!"
                </p>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-primary">Priya Patel</h3>
                    <p className="text-sm text-gray-500">Miranda House, 1st Year</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As a fresher, I was overwhelmed with college life. This site helped me find accommodation, access previous years' notes, and discover college events all in one place!"
                </p>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-primary">Rahul Gupta</h3>
                    <p className="text-sm text-gray-500">St. Stephen's College, Alumni</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As an alumnus, I love being able to mentor current students. The alumni network here makes it easy to give back to the DU community and help the next generation."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Access Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Quick access to all the resources and services for DU students
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <Link to="/resources" className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <svg className="h-12 w-12 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-primary">Study Resources</h3>
            </Link>
            
            <Link to="/events" className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <svg className="h-12 w-12 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-primary">Campus Events</h3>
            </Link>
            
            <Link to="/alumni" className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <svg className="h-12 w-12 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-primary">Alumni Network</h3>
            </Link>
            
            <Link to="/accommodation" className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <svg className="h-12 w-12 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-primary">Accommodation</h3>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to enhance your DU experience?</span>
              <span className="block text-accent">Join the community today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-accent/90"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 