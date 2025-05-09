import React, { useState } from 'react';

interface WelcomeFormProps {
  onSubmit: (formData: { name: string; mobile: string; referralCode?: string }) => void;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    referralCode: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    mobile: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      mobile: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        mobile: formData.mobile,
        referralCode: formData.referralCode || undefined
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Welcome to Hey Students!</h2>
        <p className="text-gray-600 mb-8 text-center">Your all-in-one platform for Delhi University life - accommodation, networking, resources, and more!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.mobile ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
          </div>
          
          <div className="mb-8">
            <label htmlFor="referralCode" className="block text-gray-700 font-medium mb-2">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter referral code if you have one"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300 font-medium text-lg"
          >
            Start Your DU Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeForm; 