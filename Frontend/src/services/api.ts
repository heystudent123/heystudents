import axios from 'axios';

// Define base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Accommodations API
export const accommodationsApi = {
  // Get all accommodations with optional filters
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/accommodations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      throw error;
    }
  },
  
  // Get accommodation by ID
  getById: async (id: string) => {
    try {
      const response = await api.get(`/accommodations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching accommodation ${id}:`, error);
      throw error;
    }
  },
  
  // Add review to accommodation
  addReview: async (id: string, reviewData: any) => {
    try {
      const response = await api.post(`/accommodations/${id}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },
};

// Alumni API
export const alumniApi = {
  // Get all alumni with optional filters
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/alumni', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching alumni:', error);
      throw error;
    }
  },
  
  // Get alumni by ID
  getById: async (id: string) => {
    try {
      const response = await api.get(`/alumni/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alumni ${id}:`, error);
      throw error;
    }
  },
};

// User authentication API
export interface AuthApi {
  login: (email: string, password: string) => Promise<any>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    college?: string;
    course?: string;
    year?: string;
    referralCode?: string;
  }) => Promise<any>;
  verifyReferralCode: (referralCode: string) => Promise<any>;
  loginWithPhone: (phone: string) => Promise<any>;
  updateProfile: (userId: string, profileData: any) => Promise<any>;
  completeProfile: (profileData: {
    uid: string;
    fullName: string;
    phone: string;
    email?: string;
    referralCode?: string;
    college?: string;
    collegeYear?: string;
  }) => Promise<any>;
  validateReferral: (referralCode: string) => Promise<any>;
  createInstitute: (instituteData: {
    name: string;
    mobile: string;
    email?: string;
    password?: string;
    address?: string;
    customReferralCode?: string;
  }) => Promise<any>;
  getRegisteredUsers: () => Promise<any>;
  promoteToAdmin: (userId: string) => Promise<any>;
  promoteToInstitute: (userId: string, data?: { customReferralCode?: string }) => Promise<any>;
  deleteUser: (userId: string) => Promise<any>;
  getReferrals: () => Promise<any>;
  getUsers: (role?: string) => Promise<any>;
}

export const authApi: AuthApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    college?: string;
    course?: string;
    year?: string;
    referralCode?: string;
  }) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  verifyReferralCode: async (referralCode: string) => {
    try {
      const response = await api.get(`/referrals/verify/${referralCode}`);
      return response.data;
    } catch (error) {
      console.error('Referral code verification error:', error);
      throw error;
    }
  },
  
  validateReferral: async (referralCode: string) => {
    try {
      const response = await api.get(`/validation/referral/${referralCode}`);
      return response.data;
    } catch (error) {
      console.error('Referral validation error:', error);
      throw error;
    }
  },

  loginWithPhone: async (phone: string) => {
    try {
      const response = await api.post('/users/login-phone', { phone });
      return response.data;
    } catch (error) {
      console.error('Phone login error:', error);
      throw error;
    }
  },

  updateProfile: async (_userId: string, profileData: any) => {
    try {
      const response = await api.put('/users/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  completeProfile: async (profileData: {
    uid: string;
    fullName: string;
    phone: string;
    email?: string;
    referralCode?: string;
    college?: string;
    collegeYear?: string;
  }) => {
    try {
      const response = await api.post('/users/complete-profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  },

  // This function is now updated to use the GET endpoint
  // The old POST endpoint is still available for backward compatibility

  // Create institute account (admin only)
  createInstitute: async (instituteData: {
    name: string;
    mobile: string;
    email?: string;
    password?: string;
    address?: string;
    customReferralCode?: string;
  }) => {
    try {
      const response = await api.post('/users/institute', instituteData);
      return response.data;
    } catch (error) {
      console.error('Create institute error:', error);
      throw error;
    }
  },
  
  // Get all registered users (for mobile number selection)
  getRegisteredUsers: async () => {
    try {
      const response = await api.get('/users/registered');
      return response.data;
    } catch (error) {
      console.error('Error fetching registered users:', error);
      throw error;
    }
  },

  // Promote user to admin role
  promoteToAdmin: async (userId: string) => {
    try {
      const response = await api.put(`/users/${userId}/promote`, {});
      return response.data;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      throw error;
    }
  },

  // Promote user to institute role
  promoteToInstitute: async (userId: string, data: { customReferralCode?: string } = {}) => {
    try {
      const response = await api.put(`/users/${userId}/promote-to-institute`, data);
      return response.data;
    } catch (error) {
      console.error('Error promoting user to institute:', error);
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user's referrals
  getReferrals: async () => {
    try {
      const response = await api.get('/users/referrals');
      return response.data;
    } catch (error) {
      console.error('Get referrals error:', error);
      throw error;
    }
  },

  // Get all users of a specific role (admin only)
  getUsers: async (role: string = 'user') => {
    try {
      // If role is empty string, don't include it in params to get all users
      const params = role ? { role } : {};
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },
};

export default api; 