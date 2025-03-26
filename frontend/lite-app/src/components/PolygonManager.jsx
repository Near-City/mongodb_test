import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentInfoContext from "@contexts/currentInfoContext";
const PolygonManager = ({ config, geojsonData, onPolygonClick }) => {
  const map = useMap();
  const { currentInfo } = useContext(CurrentInfoContext);

  const [leftLayerGroup, setLeftLayerGroup] = useState(L.layerGroup());

  const getColor = () => {
    return config.colors.accesibilidad.ERROR || "gray";
  };

  const styleFeature = (feature) => ({
    fillColor: getColor(),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.8,
  });

  const handlePolygonClick = (e) => {
    let instruction = onPolygonClick(e); // Propagar el evento al padre
    if (instruction === "hide") {
      showOnlyClickedPolygon(e.target.feature);
    }
  };

  const showOnlyClickedPolygon = (feature) => {
    // Crear un nuevo geojson solo con el polígono clicado
    const newGeojson = {
      type: "FeatureCollection",
      features: [feature],
    };

    // Limpiar ambos layer groups completamente
    leftLayerGroup.clearLayers();
    if (rightLayerGroup) {
      rightLayerGroup.clearLayers();
    }

    // Añadir solo el polígono clicado al layer group de la izquierda
    const newLeftLayer = L.geoJSON(newGeojson, {
      style: styleFeature,
      onEachFeature: onEachFeature,
      pane: "leftPane",
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
      click: handlePolygonClick, // Al hacer clic, solo muestra este polígono
    });
  };

  useEffect(() => {
    console.log("Current Info: ", currentInfo);
    console.log("GeojsonData: ", geojsonData);
    if (!geojsonData || !currentInfo.filter) return;

    if (leftLayerGroup) {
      // Limpiar los LayerGroups actuales
      leftLayerGroup.clearLayers();
    }

    // Crear panes si aún no existen
    if (!map.getPane("leftPane")) {
      map.createPane("leftPane").style.zIndex = 650;
    }

    // Añadir GeoJSON completo al layer group de la izquierda (esto es para el render inicial)
    const newLeftLayer = L.geoJSON(geojsonData, {
      style: styleFeature,
      onEachFeature: onEachFeature,
      pane: "leftPane",
    }).addTo(leftLayerGroup);

    // Añadir el layer group al mapa
    leftLayerGroup.addTo(map);

    setLeftLayerGroup(leftLayerGroup); // Actualizar el estado con el layer group

    // Limpiar las capas cuando se desmonte el componente

    return () => {
      if (map.hasLayer(leftLayerGroup)) {
        map.removeLayer(leftLayerGroup);
      }
    };
  }, [geojsonData, map, currentInfo.filter]);

  useEffect(() => {
    // se oculta el poligono la poner la isocrona por culpa de este useEffect y de su dependencia con isocronas
    if (!geojsonData || currentInfo.filter?.barrio || currentInfo.isocronas)
      return;

    if (leftLayerGroup) {
      // Limpiar los LayerGroups actuales
      leftLayerGroup.clearLayers();
    }
    // Crear panes si aún no existen
    if (!map.getPane("leftPane")) {
      map.createPane("leftPane").style.zIndex = 650;
    }

    // Añadir GeoJSON completo al layer group de la izquierda (esto es para el render inicial)
    L.geoJSON(geojsonData, {
      style: styleFeature,
      onEachFeature: onEachFeature,
      pane: "leftPane",
    }).addTo(leftLayerGroup);

    // Añadir el layer group al mapa
    leftLayerGroup.addTo(map);
    setLeftLayerGroup(leftLayerGroup); // Actualizar el estado con el layer group
    // Añadir el layer group al mapa

    // Limpiar las capas cuando se desmonte el componente
    return () => {
      if (map.hasLayer(leftLayerGroup)) {
        map.removeLayer(leftLayerGroup);
      }
    };
  }, [geojsonData, map, currentInfo.filter, currentInfo.isocronas]);

  return null;
};

export default PolygonManager;
