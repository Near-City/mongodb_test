import api from "./api";


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

export const get_locs = (loc_code, bounds) => {
  let boundsQuery = '';
  if (bounds){
    const { north, south, east, west} = bounds;
    boundsQuery = `?bounds=${north},${south},${east},${west}`;
  }
  return api.get(`locs/${loc_code}/${boundsQuery}`).then((response) => {
    return response.data;
  });
}

export const get_indicators = async (area, resource, extra, time, user, red, area_ids = []) => {
  // const csrfToken = await getCsrfToken();
  const payload = {
    area: area,
    resource: resource,
    extra: extra,
    time: time,
    user: user,
    red: red,
  };

  // Añadir area_ids al payload si no está vacío
  if (area_ids.length > 0) {
    payload.area_ids = area_ids;
  }

  return api.post(`indicators/`, payload, {
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

export const get_isocronas = async (area_id, time, user, red) => {
  const payload = {
    area_id: area_id,
    time: time,
    user: user,
    red: red,
  };

  return api.post(`isocronas/`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching isocronas:", error);
      throw error;
    });
};


export const get_carril_bici = async () => {
  return api.get(`carrilbici/`).then((response) => {
    return response.data;
  });

}

export const get_search = async (search) => {
  const params = new URLSearchParams();
  params.append('query', search);
  return api.get(`search/?${params.toString()}`).then((response) => {
    return response.data;
  });

}

export const get_plots_by_area_id = async (area_code, area_id) => {
  return api.get(`filter-plots/${area_code}/${area_id}/`).then((response) => {
    return response.data;
  });
}