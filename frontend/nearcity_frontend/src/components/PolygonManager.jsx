import React, { useEffect, useState, useContext } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
const PolygonManager = ({ config, geojsonData, swipeOpen }) => {
  const map = useMap();
  const { currentIndicator } = useContext(CurrentIndicatorContext);
  const { currentInfo } = useContext(CurrentInfoContext);

  const [leftLayer, setLeftLayer] = useState(null);
  const [rightLayer, setRightLayer] = useState(null);

  const getColor = (areaId) => {
    if (!config || !areaId || currentInfo.indicatorStatus != 'loaded' || !currentIndicator || !currentIndicator[areaId]) {
      console.log(areaId, currentIndicator ? currentIndicator[areaId]: null);
      return config.colors.accesibilidad.ERROR || 'gray';
    }
    
    return config.colors.accesibilidad[currentIndicator[areaId]];
  };

  const styleFeature = (feature) => {
    return {
      fillColor: getColor(feature.properties.area_id),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.8
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 1,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          fillOpacity: 0.8,
        });
      }
    });
  };

  useEffect(() => {
    
    if (!geojsonData) return;
  
    // Asegúrate de que el pane existe antes de agregar la capa
    if (!map.getPane('leftPane')) {
      map.createPane('leftPane');
      map.getPane('leftPane').style.zIndex = 650;
    }

    if (swipeOpen && !map.getPane('rightPane')) {
      map.createPane('rightPane');
      map.getPane('rightPane').style.zIndex = 650;
    }
  
    // Intenta agregar una capa simple y verifica si ocurre el mismo problema
    try {
      const newLeftLayer = L.geoJSON(geojsonData, {
        style: styleFeature,
        onEachFeature: onEachFeature,
        pane: 'leftPane',
      }).addTo(map);
  
      // Limpieza cuando el componente se desmonte
      return () => {
        map.removeLayer(newLeftLayer);
      };
    } catch (error) {
      console.error("Error al agregar la capa:", error);
    }
  }, [geojsonData,  currentIndicator, swipeOpen]);
  
  

  return null;
};

export default PolygonManager;