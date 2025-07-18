import api from './api';

// Get all wishlist items
export const getWishlist = async () => {
  try {
    const response = await api.get('/users/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add item to wishlist
export const addToWishlist = async (accommodationId: string) => {
  try {
    const response = await api.post('/users/wishlist', { accommodationId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (accommodationId: string) => {
  try {
    const response = await api.delete(`/users/wishlist/${accommodationId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};
