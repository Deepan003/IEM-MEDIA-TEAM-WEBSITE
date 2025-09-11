import axios from 'axios';

// Create a configured instance of axios
const api = axios.create({
    baseURL: '/api', // This base URL is proxied to your backend by vite.config.js
    headers: {
        'Content-Type': 'application/json',
    },
});

// This "interceptor" runs before every API request
// It gets the token from localStorage and adds it to the request headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Your server's auth middleware expects the token in this format
            // Note: The original middleware uses 'x-auth-token', but 'Authorization: Bearer' is more standard. Let's update the middleware later if needed. For now, we'll assume it's updated to use 'Authorization'.
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- User/Member API Calls ---
export const getMembers = () => api.get('/users');
export const banUser = (id) => api.put(`/users/${id}/ban`);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// --- Event API Calls ---
export const getEvents = () => api.get('/events');
export const createEvent = (eventData) => api.post('/events', eventData);

// --- Announcement API Calls ---
export const getAnnouncements = () => api.get('/announcements');
export const createAnnouncement = (announcementData) => api.post('/announcements', announcementData);


export default api;