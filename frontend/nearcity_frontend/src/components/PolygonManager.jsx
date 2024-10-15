import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import SwipeBar from "./uiMapComponents/SwipeBar";

const PolygonManager = ({ config, geojsonData, swipeOpen }) => {
  const map = useMap();
  const { currentIndicator } = useContext(CurrentIndicatorContext);
  const { currentInfo } = useContext(CurrentInfoContext);

  const [leftLayer, setLeftLayer] = useState(null);
  const [rightLayer, setRightLayer] = useState(null);

  const getColor = (areaId) => {
    if (!config || !areaId || currentInfo.indicatorStatus !== 'loaded' || !currentIndicator || !currentIndicator[areaId]) {
      return config.colors.accesibilidad.ERROR || 'gray';
    }
    return config.colors.accesibilidad[currentIndicator[areaId]];
  };

  const styleFeature = (feature) => ({
    fillColor: getColor(feature.properties.area_id),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8,
  });

  const styleFeatureRightLayer = (feature) => ({
    fillColor: 'red',
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8,
  });

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 1 });
      },
      mouseout: (e) => {
        e.target.setStyle({ fillOpacity: 0.8 });
      }
    });
  };

  useEffect(() => {
    if (!geojsonData) return;
  
    // Remover capas anteriores si existen
    if (leftLayer) {
      map.removeLayer(leftLayer);
    }
    if (rightLayer) {
      map.removeLayer(rightLayer);
    }
  
    // Crear panes si aún no existen
    if (!map.getPane('leftPane')) {
      map.createPane('leftPane').style.zIndex = 650;
    }
  
    if (swipeOpen && !map.getPane('rightPane')) {
      map.createPane('rightPane').style.zIndex = 650;
    }
  
    // Crear nuevas capas para izquierda y derecha
    const newLeftLayer = L.geoJSON(geojsonData, {
      style: styleFeature,
      onEachFeature: onEachFeature,
      pane: 'leftPane',
    }).addTo(map);
  
    setLeftLayer(newLeftLayer); // Establece la nueva capa de izquierda
  
    if (swipeOpen) {
      const newRightLayer = L.geoJSON(geojsonData, {
        style: styleFeatureRightLayer,
        onEachFeature: onEachFeature,
        pane: 'rightPane',
      }).addTo(map);
      setRightLayer(newRightLayer); // Establece la nueva capa de derecha
    } else {
      setRightLayer(null); // Remueve la capa derecha si swipeOpen está cerrado
    }
  
    // Limpiar las capas cuando se desmonte el componente
    return () => {
      if (map.hasLayer(newLeftLayer)) {
        map.removeLayer(newLeftLayer);
      }
      if (rightLayer && map.hasLayer(rightLayer)) {
        map.removeLayer(rightLayer);
      }
    };
  }, [geojsonData, currentIndicator, swipeOpen, map]);
  

  return swipeOpen && leftLayer && rightLayer ? (
    <SwipeBar map={map} leftLayer={leftLayer} rightLayer={rightLayer}/>
  ) : null;
};

export default PolygonManager;
