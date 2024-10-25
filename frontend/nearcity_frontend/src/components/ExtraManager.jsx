import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentInfoContext from "@contexts/currentInfoContext";

const ExtraManager = ({ config, geojsonData, activeExtra }) => {
  const map = useMap();
  const { currentInfo } = useContext(CurrentInfoContext);

  const [layerGroup, setLayerGroup] = useState(L.layerGroup());
  const [carril_bici, setCarrilBici] = useState(null);

  const getColor = (areaId) => {
    return "red";
  };

  const styleLine = (feature) => ({
    color: getColor(feature.properties.area_id),
    weight: 3,
    opacity: 0.7,
  });

  const render_layer = (data) => {
    if (!data) {
      return;
    }

    // Limpiar el layer group actual si existe
    if (layerGroup) {
      layerGroup.clearLayers();
    }

    // Crear pane para los puntos si aún no existe
    if (!map.getPane("extraPane")) {
      map.createPane("extraPane").style.zIndex = 750;
    }

    // Crear la capa GeoJSON para las líneas y añadirla al layer group
    const geojsonLayer = L.geoJSON(data, {
      style: styleLine,
      pane: "extraPane",
    });

    // Añadir la capa GeoJSON al layer group y al mapa
    geojsonLayer.addTo(layerGroup);
    layerGroup.addTo(map);
    setLayerGroup(layerGroup);
  };

  useEffect(() => {
    if (!geojsonData || !activeExtra) {
      return;
    }

    console.log("ExtraManager geojsonData: ", geojsonData);
    Object.keys(activeExtra).forEach((extra) => {
      if (activeExtra[extra] && geojsonData[extra]) {
        console.log("Rendering extra: ", extra);
        render_layer(geojsonData[extra]);
      }
    });

    // Limpiar las capas cuando se desmonte el componente
    return () => {
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    };
  }, [geojsonData, activeExtra, map, layerGroup]);

  return null;
};

export default ExtraManager;
