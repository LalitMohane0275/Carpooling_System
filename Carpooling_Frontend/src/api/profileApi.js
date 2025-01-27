import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/profile'; // Replace with your actual API base URL

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add authorization header if needed
    // 'Authorization': `Bearer ${token}`
  },
});

export const getProfile = async (userName) => {
  try {
    const response = await api.get(`/get-profile/${userName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// export const updateProfile = async (profileData) => {
//   try {
//     const response = await api.put('/profile', profileData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     throw error;
//   }
// };
