import axios from 'axios';

// REPLACE THIS WITH YOUR COMPUTER'S LOCAL IP ADDRESS
// On Mac/Linux: run `ifconfig` in terminal
// On Windows: run `ipconfig` in cmd
const API_URL = 'https://fd3c5c40b3fe.ngrok-free.app/api/v1'; 

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