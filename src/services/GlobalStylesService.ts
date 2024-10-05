import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchGlobalStyles = async () => {
  try {
    const response = await axios.get(`${API_URL}/styles`); 
    return response.data;
  } catch (error) {
    console.error('Error fetching global styles:', error);
    throw error;
  }
};
