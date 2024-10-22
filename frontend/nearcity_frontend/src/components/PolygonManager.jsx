import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import SecondIndicatorContext from "@contexts/secondIndicatorContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import SwipeBar from "./uiMapComponents/SwipeBar";

const PolygonManager = ({ config, geojsonData, swipeOpen, onPolygonClick }) => {
  const map = useMap();
  const { currentIndicator } = useContext(CurrentIndicatorContext);
  const { secondIndicator } = useContext(SecondIndicatorContext);
  const { currentInfo } = useContext(CurrentInfoContext);

  const [leftLayerGroup, setLeftLayerGroup] = useState(L.layerGroup());
  const [rightLayerGroup, setRightLayerGroup] = useState(null);

  const getColor = (areaId, indicator) => {
    if (!config || !areaId || currentInfo.indicatorStatus !== 'loaded' || !indicator || !indicator[areaId]) {
      return config.colors.accesibilidad.ERROR || 'gray';
    }
    return config.colors.accesibilidad[indicator[areaId]];
  };

  const styleFeatureMainIndicator = (feature) => ({
    fillColor: getColor(feature.properties.area_id, currentIndicator),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8,
  });

  const styleFeatureSecondIndicator = (feature) => ({
    fillColor: getColor(feature.properties.area_id, secondIndicator),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8,
  });

  const handlePolygonClick = (e) => {
    if (swipeOpen) return; // No hacer nada si el swipe está abierto
    let instruction = onPolygonClick(e); // Propagar el evento al padre
    if (instruction === 'hide') {
    showOnlyClickedPolygon(e.target.feature);
    }
  };

  const showOnlyClickedPolygon = (feature) => {
    // Crear un nuevo geojson solo con el polígono clicado
    const newGeojson = {
      type: 'FeatureCollection',
      features: [feature],
    };

    // Limpiar ambos layer groups completamente
    leftLayerGroup.clearLayers();
    if (rightLayerGroup) {
      rightLayerGroup.clearLayers();
    }

    // Añadir solo el polígono clicado al layer group de la izquierda
    const newLeftLayer = L.geoJSON(newGeojson, {
      style: styleFeatureMainIndicator,
      onEachFeature: onEachFeature,
      pane: 'leftPane',
    }).addTo(leftLayerGroup);

    // Añadir el layer group al mapa si aún no está añadido
    if (!map.hasLayer(leftLayerGroup)) {
      leftLayerGroup.addTo(map);
    }

    console.log("Showing clicked polygon:", newLeftLayer);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 1 });
      },
      mouseout: (e) => {
        e.target.setStyle({ fillOpacity: 0.8 });
      },
      click: handlePolygonClick,  // Al hacer clic, solo muestra este polígono
    });
  };

  useEffect(() => {
    if (!geojsonData) return;

    if (leftLayerGroup) {
    // Limpiar los LayerGroups actuales
    leftLayerGroup.clearLayers();
    }
    if (rightLayerGroup){
      rightLayerGroup.clearLayers();
    }

    // Crear panes si aún no existen
    if (!map.getPane('leftPane')) {
      map.createPane('leftPane').style.zIndex = 650;
    }

    if (swipeOpen && !map.getPane('rightPane')) {
      map.createPane('rightPane').style.zIndex = 650;
    }
    
    // Añadir GeoJSON completo al layer group de la izquierda (esto es para el render inicial)
    const newLeftLayer = L.geoJSON(geojsonData, {
      style: styleFeatureMainIndicator,
      onEachFeature: onEachFeature,
      pane: 'leftPane',
    }).addTo(leftLayerGroup);

    // Añadir el layer group al mapa
    leftLayerGroup.addTo(map);
    setLeftLayerGroup(leftLayerGroup); // Actualizar el estado con el layer group

    if (swipeOpen) {
      const rightLayerGroup = L.layerGroup(); // Crear un nuevo layer group para la derecha
      const newRightLayer = L.geoJSON(geojsonData, {
        style: styleFeatureSecondIndicator,
        onEachFeature: onEachFeature,
        pane: 'rightPane',
      }).addTo(rightLayerGroup);

      rightLayerGroup.addTo(map); // Añadir al mapa
      setRightLayerGroup(rightLayerGroup); // Actualizar el estado con el layer group derecho
    } else {
      setRightLayerGroup(null); // Limpiar el rightLayer si swipeOpen está cerrado
    }

    // Limpiar las capas cuando se desmonte el componente
    return () => {
      if (map.hasLayer(leftLayerGroup)) {
        map.removeLayer(leftLayerGroup);
      }
      if (rightLayerGroup && map.hasLayer(rightLayerGroup)) {
        map.removeLayer(rightLayerGroup);
      }
    };
  }, [geojsonData, currentIndicator, secondIndicator, swipeOpen, map]);

  return swipeOpen && leftLayerGroup && rightLayerGroup ? (
    <SwipeBar map={map} leftLayer={leftLayerGroup} rightLayer={rightLayerGroup} />
  ) : null;
};

export default PolygonManager;
