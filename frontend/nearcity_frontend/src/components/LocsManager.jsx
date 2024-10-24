import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentInfoContext from "@contexts/currentInfoContext";

const LocsManager = ({ config, geojsonData, onPolygonClick }) => {
  const map = useMap();
  const { currentInfo } = useContext(CurrentInfoContext);

  const [layerGroup, setLayerGroup] = useState(L.layerGroup());

  const getColor = (areaId) => {
    return "red"; // Color rojo para los puntos
  };

  const styleMarker = (feature) => ({
    radius: 8, // Radio del círculo
    fillColor: getColor(feature.properties.area_id),
    color: "#fff", // Color del borde
    weight: 1,
    opacity: 0.6,
    fillOpacity: 0.8,
  });

  const getProperties = (feature) => {
    return feature.properties;
  }

  const handlePointClick = (e) => {
    const properties = e.target.options.properties;
    // Mostrar un tooltip con información del hospital
    
    // poner las propiedades dinámicas del punto con un bucle
    let tooltipContent = "";
    for (const [key, value] of Object.entries(properties)) {
      tooltipContent += `<b>${key}:</b> ${value}<br>`;
    }

    e.target
      .bindTooltip(tooltipContent, { pane: "locsPane" }) // Asignar el pane al tooltip
      .openTooltip();

    // onPolygonClick(e); // Propagar el evento al padre si es necesario
  };

  useEffect(() => {
    if (!geojsonData) {
      return;
    }

    // Limpiar el layer group actual si existe
    if (layerGroup) {
      layerGroup.clearLayers();
    }

    // Crear pane para los puntos si aún no existe
    if (!map.getPane("locsPane")) {
      map.createPane("locsPane").style.zIndex = 750; // Z-index más alto que el de las isocronas
    }

    // Iterar sobre cada feature del geojsonData para crear los puntos
    geojsonData.forEach((feature) => {
      const coordinates = feature.geometry.coordinates;
      const point = L.circleMarker([coordinates[1], coordinates[0]], {
        ...styleMarker(feature),
        pane: "locsPane", // Asignar el pane con el zIndex más alto
        properties: getProperties(feature),
      })
        .on("click", handlePointClick) // Añadir evento de clic
        .addTo(layerGroup); // Añadir al grupo de capas
    });

    // Añadir el layer group al mapa
    layerGroup.addTo(map);
    setLayerGroup(layerGroup); // Actualizar el estado con el layer group

    // Limpiar las capas cuando se desmonte el componente
    return () => {
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    };
  }, [geojsonData, map, layerGroup]);

  return null;
};

export default LocsManager;
