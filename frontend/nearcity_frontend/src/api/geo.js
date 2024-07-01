import api from "./api";

const API_URL = 'http://localhost:8000/api/'

export const getConfig = () => {
  return api.get(`config/`).then((response) => {
    return response.data;
  });
}

// Función para obtener el token CSRF
export const getCsrfToken = async () => {
  let csrfToken = null;
  if (!csrfToken) {
      try {
          const response = await api.get('csrf/');
          csrfToken = response.data.csrfToken;
          console.log("CSRF Token obtained:", csrfToken);
      } catch (error) {
          console.error('Error fetching CSRF token:', error);
          throw error;
      }
  }
  return csrfToken;
};


export const getBarrios = () => {
  return api.get(`barrios/`).then((response) => {
    return response.data;
  });
};

export const getDistritos = () => {
  return api.get(`distritos/`).then((response) => {
    return response.data;
  });
};

export const getSecciones = () => {
  return api.get(`secciones/`).then((response) => {
    return response.data;
  });
}

export const getParcelas = async (bounds) => { // las bounds son las coordenadas del mapa para renderizar las parcelas
  const { north, south, east, west} = bounds;
  
  
  try {
    const response = await api.get(`parcelas/?north=${north}&south=${south}&east=${east}&west=${west}`);
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
  return api.get(`polygons/${type_code}/${boundsQuery}`).then((response) => {
    console.log("Data: ", response);
    return response.data;
  });
}

export const get_points = (type_code) => {
  return api.get(`points/${type_code}/`).then((response) => {
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
