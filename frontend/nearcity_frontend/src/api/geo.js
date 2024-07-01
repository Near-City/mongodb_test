import api from "./api";
import { getCsrfToken } from "./auth";
const API_URL = 'http://localhost:8000/api/'

export const getConfig = () => {
  return api.get(`${API_URL}config/`).then((response) => {
    return response.data;
  });
}

export const getBarrios = () => {
  return api.get(`${API_URL}barrios/`).then((response) => {
    return response.data;
  });
};

export const getDistritos = () => {
  return api.get(`${API_URL}distritos/`).then((response) => {
    return response.data;
  });
};

export const getSecciones = () => {
  return api.get(`${API_URL}secciones/`).then((response) => {
    return response.data;
  });
}

export const getParcelas = async (bounds) => { // las bounds son las coordenadas del mapa para renderizar las parcelas
  const { north, south, east, west} = bounds;
  
  
  try {
    const response = await api.get(`${API_URL}parcelas/?north=${north}&south=${south}&east=${east}&west=${west}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parcelas:", error);
    throw error; // O manejar el error de manera que prefieras
  }
}

export const get_polygons = (type_code, bounds = null) => {
  let boundsQuery = '';
  if (bounds){
    const { north, south, east, west} = bounds;
    boundsQuery = `?bounds=${north},${south},${east},${west}`;
  }
  return api.get(`${API_URL}polygons/${type_code}/${boundsQuery}`).then((response) => {
    console.log("Data: ", response);
    return response.data;
  });
}

export const get_points = (type_code) => {
  return api.get(`${API_URL}points/${type_code}/`).then((response) => {
    return response.data;
  });
}

export const get_indicators = async (area, resource, extra, time, user, area_ids = []) => {
  // const csrfToken = await getCsrfToken();
  const payload = {
    area: area,
    resource: resource,
    extra: extra,
    time: time,
    user: user,
  };

  // Añadir area_ids al payload si no está vacío
  if (area_ids.length > 0) {
    payload.area_ids = area_ids;
  }

  return api.post(`${API_URL}indicators/`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching indicators:", error);
      throw error;
    });
};
