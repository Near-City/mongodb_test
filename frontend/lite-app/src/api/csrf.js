// csrf.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Esto permite a Axios enviar cookies con las solicitudes
});

const getCSRFToken = async () => {
    try {
        const response = await axiosInstance.get('/csrf/');
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
    }
};

export default getCSRFToken;
