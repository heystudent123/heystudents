import axios from 'axios';

// ✅ Validate API URL environment variable
if (!process.env.REACT_APP_API_URL) {
  throw new Error('❌ REACT_APP_API_URL is not defined! Please set it in your environment variables before building.');
}
const API_BASE_URL = process.env.REACT_APP_API_URL;


// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token to requests if available
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

// =================== ACCOMMODATIONS API ===================
export const accommodationsApi = {
  getAll: async (filters = {}) => {
    try {
      // Request a high limit to get all accommodations
      const params = { ...filters, limit: 100 };
      const response = await api.get('/accommodations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/accommodations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching accommodation ${id}:`, error);
      throw error;
    }
  },

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

// =================== ALUMNI API ===================
export const alumniApi = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/alumni', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching alumni:', error);
      throw error;
    }
  },

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

// =================== AUTH API ===================
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
  validateReferral: (referralCode: string) => Promise<any>;
  loginWithPhone: (phone: string, userData?: { name?: string }) => Promise<any>;
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
  getRegisteredUsers: () => Promise<any>;
  promoteToAdmin: (userId: string) => Promise<any>;
  deleteUser: (userId: string) => Promise<any>;
  getReferrals: () => Promise<any>;
  getUsers: (role?: string) => Promise<any>;
  promoteToInstitute: (userId: string, customReferralCode?: string) => Promise<any>;
  getInstitutes: () => Promise<any>;
  validateReferralCode: (referralCode: string) => Promise<any>;
  getServerHealth: () => Promise<any>;
  getApiStats: () => Promise<any>;
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

  register: async (userData) => {
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

  loginWithPhone: async (phone: string, userData?: { name?: string }) => {
    try {
      const payload = userData?.name ? { phone, name: userData.name } : { phone };
      const response = await api.post('/users/login-phone', payload);
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

  completeProfile: async (profileData) => {
    try {
      const response = await api.post('/users/complete-profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  },

  getRegisteredUsers: async () => {
    try {
      const response = await api.get('/users/registered');
      return response.data;
    } catch (error) {
      console.error('Error fetching registered users:', error);
      throw error;
    }
  },

  promoteToAdmin: async (userId: string) => {
    try {
      const response = await api.put(`/users/${userId}/promote`, {});
      return response.data;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  getReferrals: async () => {
    try {
      const response = await api.get('/users/referrals');
      return response.data;
    } catch (error) {
      console.error('Get referrals error:', error);
      throw error;
    }
  },

  getUsers: async (role: string = 'user') => {
    try {
      const params = role ? { role } : {};
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  promoteToInstitute: async (userId: string, customReferralCode?: string) => {
    try {
      const response = await api.put(`/admin/users/${userId}/promote-to-institute`, { customReferralCode });
      return response.data;
    } catch (error) {
      console.error('Error promoting user to institute:', error);
      throw error;
    }
  },

  getInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes');
      return response.data;
    } catch (error) {
      console.error('Error fetching institutes:', error);
      throw error;
    }
  },

  validateReferralCode: async (referralCode: string) => {
    try {
      const response = await api.get(`/validation/referral-code/${referralCode}`);
      return response.data;
    } catch (error) {
      console.error('Error validating referral code:', error);
      throw error;
    }
  },

  getServerHealth: async () => {
    try {
      const response = await api.get('/server/health');
      return response.data;
    } catch (error) {
      console.error('Error getting server health:', error);
      throw error;
    }
  },

  getApiStats: async () => {
    try {
      const response = await api.get('/server/api-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching API stats:', error);
      throw error;
    }
  },
};

export default api;
