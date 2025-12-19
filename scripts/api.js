const API_BASE_URL = 'http://localhost:3000/api';

const API = {
    // Save token
    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Clear token (logout)
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    },

    // Generic request handler
    request: async (endpoint, method = 'GET', body = null) => {
        const token = API.getToken();
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'API Request Failed');
            }
            return data;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    },

    // Auth methods
    login: async (email, password) => {
        return API.request('/auth/login', 'POST', { email, password });
    },

    register: async (userData) => {
        return API.request('/auth/register', 'POST', userData);
    },

    getProfile: async () => {
        return API.request('/auth/me');
    },

    // Venues
    getVenues: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        return API.request(`/venues?${query}`);
    },

    getVenue: async (id) => {
        return API.request(`/venues/${id}`);
    },

    // Bookings
    createBooking: async (bookingData) => {
        return API.request('/bookings', 'POST', bookingData);
    },

    getBookings: async () => {
        return API.request('/bookings/history');
    },

    getBooking: async (id) => {
        return API.request(`/bookings/${id}`);
    },

    cancelBooking: async (id) => {
        return API.request(`/bookings/${id}/cancel`, 'PUT');
    },

    // Payment
    processPayment: async (paymentData) => {
        return API.request('/payments', 'POST', paymentData);
    },

    // Profile
    updateProfile: async (profileData) => {
        return API.request('/profile', 'PUT', profileData);
    },

    changePassword: async (passwordData) => {
        return API.request('/profile/password', 'PUT', passwordData);
    },

    uploadProfileImage: async (formData) => {
        const token = API.getToken();
        const response = await fetch(`${API_BASE_URL}/profile/upload-image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type for FormData
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed');
        return data;
    }
};
