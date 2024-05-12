import axios from 'axios';

const API_URL = 'http://localhost:8000/'

export const getBarrios = () => {
  return axios.get(`${API_URL}barrios/`).then((response) => {
    return response.data;
  });
};

export const getDistritos = () => {
  return axios.get(`${API_URL}distritos/`).then((response) => {
    return response.data;
  });
};

export const getSecciones = () => {
  return axios.get(`${API_URL}secciones/`).then((response) => {
    return response.data;
  });
}

export const getParcelas = () => {
  return axios.get(`${API_URL}parcelas/`).then((response) => {
    return response.data;
  });
}

