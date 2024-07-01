import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Reemplaza con tu URL de API

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Opcional: establece un tiempo de espera para las peticiones
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Errores de respuesta del servidor (código de estado fuera de 2xx)
            console.error('Error en la respuesta del servidor:', error.response.data);
        } else if (error.request) {
            // Errores relacionados con la solicitud (sin respuesta recibida)
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            // Otros errores (configuración incorrecta, etc.)
            console.error('Error en la configuración de la solicitud:', error.message);
        }        
        return Promise.reject(error);
    }
);

export default api;
