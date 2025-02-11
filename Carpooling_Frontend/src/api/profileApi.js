import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/profile'; // Replace with your actual API base URL

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProfile = async (user_id) => {
  try {
    const response = await api.get(`/get-profile/${user_id}`,{
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
