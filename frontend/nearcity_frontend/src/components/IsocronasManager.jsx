import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentInfoContext from "@contexts/currentInfoContext";

const IsocronasManager = ({ config, geojsonData, onPolygonClick }) => {
  const map = useMap();
  const { currentInfo } = useContext(CurrentInfoContext);

  const [layerGroup, setLayerGroup] = useState(L.layerGroup());
  const [initialView, setInitialView] = useState(null);

  const getColor = (areaId) => {
    return "yellow";
  };

  const styleFeature = (feature) => ({
    fillColor: getColor(feature.properties.area_id),
    weight: 1,
    opacity: 0.6,
    color: "white",
    fillOpacity: 0.6,
  });

  const handlePolygonClick = (e) => {
    onPolygonClick(e); // Propagar el evento al padre
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: handlePolygonClick, // Al hacer clic, solo muestra este polígono
    });
  };

  useEffect(() => {
    if (!geojsonData && initialView?.center && initialView?.zoom) {
      let zoomToRestore = initialView.zoom;
      if (zoomToRestore === map.getZoom()) {
        zoomToRestore = zoomToRestore + 1;
      }
      // Si geojsonData es nulo, restaurar la vista inicial
      map.setView(initialView.center, zoomToRestore);
      return;
    }

    // Limpiar el layer group actual si existe
    if (layerGroup) {
      layerGroup.clearLayers();
    }

    // Crear panes si aún no existen
    if (!map.getPane("isocronasPane")) {
      map.createPane("isocronasPane").style.zIndex = 650;
    }

    // Añadir GeoJSON completo al layer group de la izquierda (esto es para el render inicial)
    const newLayer = L.geoJSON(geojsonData, {
      style: styleFeature,
      onEachFeature: onEachFeature,
      pane: "isocronasPane",
    }).addTo(layerGroup);

    // Añadir el layer group al mapa
    layerGroup.addTo(map);
    setLayerGroup(layerGroup); // Actualizar el estado con el layer group

    // Ajustar el zoom y centrar el mapa a la isocrona
    const bounds = newLayer.getBounds(); // Obtener los límites de la capa
    if (bounds.isValid()) {
      setInitialView({ center: bounds.getCenter(), zoom: map.getZoom() });
      map.fitBounds(bounds, { padding: [50, 50] }); // Ajustar el mapa a los límites
    }

    // Limpiar las capas cuando se desmonte el componente
    return () => {
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    };
  }, [geojsonData, map, layerGroup]);

  return null;
};

export default IsocronasManager;

