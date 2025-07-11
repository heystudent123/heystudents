import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Last updated: June 15, 2023
            </p>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <svg className="w-full h-12 text-neutral-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-soft p-8">
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              At Hey Students, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you:
            </p>
            <ul>
              <li>Create an account</li>
              <li>Fill out a form</li>
              <li>Contact customer support</li>
              <li>Use interactive features of our platform</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            
            <p>
              The types of information we may collect include:
            </p>
            <ul>
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Payment information (processed securely through our payment processors)</li>
              <li>Communication preferences</li>
              <li>User-generated content</li>
            </ul>
            
            <h2>Automatically Collected Information</h2>
            <p>
              When you access our platform, we may automatically collect:
            </p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, referring URLs)</li>
              <li>Location information (with your consent)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative messages and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience</li>
              <li>Monitor and analyze usage trends</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Protect the security and integrity of our platform</li>
            </ul>
            
            <h2>Sharing Your Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Service providers who perform services on our behalf</li>
              <li>Business partners with your consent</li>
              <li>Other users when you use interactive features</li>
              <li>Legal authorities when required by law</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
            </ul>
            
            <h2>Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul>
              <li>Access and update your information through your account settings</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Disable cookies through your browser settings</li>
              <li>Request data portability or restriction of processing</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
            
            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than the one in which you reside. These countries may have different data protection laws than your country of residence.
            </p>
            
            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will delete that information.
            </p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy frequently to stay informed about how we are protecting your information.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
            </p>
            <p>
              Email: privacy@heystudents.com<br />
              Address: 123 University Road, North Campus, Delhi - 110007<br />
              Phone: +91 9876543210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
