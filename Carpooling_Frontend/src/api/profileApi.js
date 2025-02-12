import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/profile'; 

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProfile = async (userId) => {
  try {
    const response = await api.get(`/get-profile/${userId}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
