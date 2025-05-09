import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Hey Students
          </h1>
          <p className="text-xl text-gray-600">
            Your trusted platform for finding the perfect PG near Delhi University
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At Hey Students, our mission is to simplify the PG search process for Delhi University students. 
                We understand the challenges of finding suitable accommodation near campus, and we're here to make that journey easier.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that every student deserves a safe, comfortable, and affordable place to stay during their 
                academic journey. Through our platform, we aim to connect students with PG owners and help them find 
                accommodation that meets their specific needs and preferences.
              </p>
              <p className="text-gray-600">
                Our goal is to become the go-to resource for all DU students looking for PGs, ensuring they have 
                access to comprehensive information, verified reviews, and direct contact with property owners.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Delhi University Campus" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Search & Filter</h3>
              <p className="text-gray-600">
                Use our powerful search filters to find PGs based on location, price, 
                facilities, mess type, and distance to college and metro stations.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Browse & Compare</h3>
              <p className="text-gray-600">
                View detailed information about each PG, including photos, amenities, 
                pricing, and student reviews to make informed decisions.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Contact & Visit</h3>
              <p className="text-gray-600">
                Directly contact PG owners through our platform to ask questions, 
                schedule visits, and secure your ideal accommodation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Team Member"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-primary">Vikram Mehta</h3>
              <p className="text-gray-500">Founder & CEO</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Team Member"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-primary">Aisha Patel</h3>
              <p className="text-gray-500">Operations Manager</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Team Member"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-primary">Rahul Sharma</h3>
              <p className="text-gray-500">Technical Lead</p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">Contact Us</h2>
          <p className="text-center text-gray-600 mb-8">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Email</h3>
                <p className="text-gray-600">info@duflatfinder.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Phone</h3>
                <p className="text-gray-600">+91 9876543210</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Address</h3>
                <p className="text-gray-600">123 University Road, North Campus, Delhi - 110007</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Office Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 