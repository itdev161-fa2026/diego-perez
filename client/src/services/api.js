import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add request interceptor to include auth token
api.insterceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token invalid or expired, clear it
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API calls
export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post('/users', { name, email, password });
        return response.data;
    } catch (error) {
        console.error('Error registering user: ', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error loggin in: ', error);
        throw error;
    }
};

// Get all posts
export const getPosts = async () => {
    try {
        const response = await axios.get('${API_URL}/posts');
        return response.data;
    } catch (error){
        console.error('Error fetching posts: ', error);
        throw error;
    }
};

// Get single post by ID
export const getPostById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};
