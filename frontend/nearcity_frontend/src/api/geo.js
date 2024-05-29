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

export const getParcelas = (bounds) => { // las bounds son las coordenadas del mapa para renderizar las parcelas
  const { north, south, east, west} = bounds;
  return axios.get(`${API_URL}parcelas?north=${north}&south=${south}&east=${east}&west=${west}`).then((response) => {
    return response.data;
  });
}

