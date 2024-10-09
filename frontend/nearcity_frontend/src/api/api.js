import axios from 'axios';
import getCSRFToken from './csrf';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Ajusta esta URL según tu configuración
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Esto permite a Axios enviar cookies con las solicitudes
});

// Función para configurar el token CSRF
const configureAxios = async () => {
    const token = await getCSRFToken();
    if (token) {
        console.log("CSRF Token obtained:", token);
        axiosInstance.defaults.headers.common['X-CSRFToken'] = token;
    }
};

// Llama a configureAxios para asegurarte de que el token se configura antes de hacer peticiones
configureAxios();

export default axiosInstance;
