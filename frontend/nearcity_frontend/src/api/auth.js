import api from './api'; // Asegúrate de ajustar la ruta

export const getCsrfToken = async () => {
    try {
        const response = await api.get('csrf/');
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

// Interceptor para incluir el token CSRF en las solicitudes
api.interceptors.request.use(
    async config => {
        const csrfToken = await getCsrfToken();
        config.headers['X-CSRFToken'] = csrfToken;
        return config;
    },
    error => Promise.reject(error)
);
