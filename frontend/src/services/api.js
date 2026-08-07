import axios from 'axios';

// Use VITE_API_URL env variable (set in .env.local for dev, Vercel env for prod)
// If not set, it defaults to the live Render backend
const API_URL = import.meta.env.VITE_API_URL || 'https://jobytra.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
