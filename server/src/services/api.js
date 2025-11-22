import axios from 'axios';

// REPLACE THIS WITH YOUR COMPUTER'S LOCAL IP ADDRESS
// On Mac/Linux: run `ifconfig` in terminal
// On Windows: run `ipconfig` in cmd
const API_URL = 'http://192.168.1.5:8000/api/v1'; 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLocations = async () => {
    try {
        const response = await api.get('/locations');
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
    }
};

export const getUserProfile = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export default api;