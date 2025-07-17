import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../utils/auth';

// Get all wishlist items
export const getWishlist = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const response = await axios.get(`${API_URL}/users/wishlist`, config);
  return response.data;
};

// Add item to wishlist
export const addToWishlist = async (accommodationId: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const response = await axios.post(`${API_URL}/users/wishlist`, { accommodationId }, config);
  return response.data;
};

// Remove item from wishlist
export const removeFromWishlist = async (accommodationId: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/users/wishlist/${accommodationId}`, config);
  return response.data;
};
