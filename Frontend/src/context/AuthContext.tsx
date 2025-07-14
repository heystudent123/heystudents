import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api';
import { sendOTP, verifyOTP, resetRecaptcha } from '../firebase/phoneAuth';

interface User {
  _id: string;
  name: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  role: string;
  referralCode?: string;
  college?: string;
  collegeYear?: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (userData: any) => Promise<User>;
  logout: () => void;
  sendPhoneOTP: (phoneNumber: string, recaptchaContainerId: string) => Promise<boolean>;
  verifyPhoneOTP: (otp: string) => Promise<any>;
  loginWithPhone: (phoneNumber: string, userData?: any) => Promise<User>;
  updateUserProfile: (profileData: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const signup = async (userData: any): Promise<User> => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Update state
      setUser(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
  };

  // Send OTP to phone number
  const sendPhoneOTP = async (phoneNumber: string, recaptchaContainerId: string): Promise<boolean> => {
    setLoading(true);
    try {
      return await sendOTP(phoneNumber, recaptchaContainerId);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP entered by user
  const verifyPhoneOTP = async (otp: string) => {
    setLoading(true);
    try {
      const result = await verifyOTP(otp);
      setVerifiedPhoneNumber(result.phoneNumber);
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login or register with verified phone number
  const loginWithPhone = async (phoneNumber: string, userData?: any): Promise<User> => {
    setLoading(true);
    try {
      // Normalize phone numbers to avoid mismatches due to spaces or formatting
      const normalize = (num: string | null) => {
      const digits = (num || '').replace(/\D/g, '');
      return digits.slice(-10); // Use last 10 digits for comparison
    };
      if (verifiedPhoneNumber && normalize(verifiedPhoneNumber) !== normalize(phoneNumber)) {
        throw new Error('Phone number not verified');
      }

      const normalized = normalize(phoneNumber);

      // Try to login with phone number
      try {
        const response = await authApi.loginWithPhone(normalized);
        
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Update state
        setUser(response.data);
        resetRecaptcha();
        return response.data;
      } catch (error: any) {
        // If user doesn't exist and userData is provided, register new user
        if (error.response?.status === 404 && userData) {
          const response = await authApi.register({
            ...userData,
            phone: normalized
          });
          
          // Store token and user data
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.data));
          
          // Update state
          setUser(response.data);
          resetRecaptcha();
          return response.data;
        }
        throw error;
      }
    } finally {
      setLoading(false);
      setVerifiedPhoneNumber(null);
    }
  };

  // Update user profile data
  const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      // Get current user data
      if (!user) {
        throw new Error('No user is logged in');
      }

      // Update user profile in backend
      const response = await authApi.updateProfile(user._id, profileData);
      
      // Update local storage with new user data
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signup, 
      logout, 
      sendPhoneOTP, 
      verifyPhoneOTP, 
      loginWithPhone,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 