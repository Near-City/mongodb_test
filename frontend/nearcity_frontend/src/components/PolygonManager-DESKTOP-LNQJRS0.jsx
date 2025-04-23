import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import SecondIndicatorContext from "@contexts/secondIndicatorContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import SwipeBar from "./uiMapComponents/SwipeBar";
import { find_polygon_with_area_id } from "../mixins/utils";
import * as d3 from "d3"; 
const PolygonManager = ({ config, geojsonData, swipeOpen, onPolygonClick, userIndicatorPref = "categorical" }) => {
  const map = useMap();
  const { currentIndicator } = useContext(CurrentIndicatorContext);
  const { secondIndicator } = useContext(SecondIndicatorContext);
  const { currentInfo } = useContext(CurrentInfoContext);

  const [leftLayerGroup, setLeftLayerGroup] = useState(L.layerGroup());
  const [rightLayerGroup, setRightLayerGroup] = useState(null);
  const [selectedPolygonLayer, setSelectedPolygonLayer] = useState(null);

  const colorScale = d3
    .scaleLinear()
    .domain([0, 0.5, 1]) // 0 = rojo, 0.5 = amarillo, 1 = verde
    .range(["#ff0000", "#ffff00", "#00ff00"]);

  const polygonHasIndicator = (areaId, indicator) => {
    return !(
      !config ||
      !areaId ||
      currentInfo.indicatorStatus !== "loaded" ||
      !indicator ||
      !indicator[areaId]
    );
  };
  

  const getColor = (areaId, indicator) => {
    if (!polygonHasIndicator(areaId, indicator)) {
      return config.colors.accesibilidad.ERROR || "gray";
    }
    
    if (userIndicatorPref === "numerical") {
      if (!indicator[areaId]?.numerical) {
        return config.colors.accesibilidad.ERROR || "gray";
      }
      console.log("ColorScale: ", colorScale(indicator[areaId]?.numerical));
      return colorScale(indicator[areaId]?.numerical);
    }
    
    return config.colors.accesibilidad[indicator[areaId]?.categorical];
  };

  const styleFeatureMainIndicator = (feature) => ({
    fillColor: getColor(feature.properties.area_id, currentIndicator),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.8,
  });

  const styleFeatureSecondIndicator = (feature) => ({
    fillColor: getColor(feature.properties.area_id, secondIndicator),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.8,
  });

  const handlePolygonClick = (e) => {
    if (swipeOpen) return; // No hacer nada si el swipe está abierto
    // if (!polygonHasIndicator(e.target.feature.properties.area_id, currentIndicator)) return; // No hacer nada si no hay indicador
    let instruction = onPolygonClick(e); // Propagar el evento al padre
    if (instruction === "hide") {
      console.log("Hiding polygon");
      // Limpiar ambos layer groups completamente 
      

      showOnlyClickedPolygon(e.target.feature);
    }
  };

  const showOnlyClickedPolygon = (feature) => {
    
    // Crear un nuevo geojson solo con el polígono clicado
    
    leftLayerGroup.clearLayers();
    if (rightLayerGroup) {
      rightLayerGroup.clearLayers();
    }
    if (selectedPolygonLayer) {
      map.removeLayer(selectedPolygonLayer); // Limpiar el polígono seleccionado anterior para que no se acumulen
    }
    
    const newGeojson = {
      type: "FeatureCollection",
      features: [feature],
    };
    const layer = L.geoJSON(newGeojson, {
      style: styleFeatureMainIndicator,
      onEachFeature: onEachFeature,
      pane: "leftPane",
    }).addTo(map);
    
    setSelectedPolygonLayer(layer); // Guardas el polígono seleccionado para poder eliminarlo después
    console.log("Showing clicked polygon:", feature);
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
    if (!geojsonData ) return;

    if (leftLayerGroup) {
      // Limpiar los LayerGroups actuales
      leftLayerGroup.clearLayers();
    }
    if (rightLayerGroup) {
      rightLayerGroup.clearLayers();
    }

    // Crear panes si aún no existen
    if (!map.getPane("leftPane")) {
      map.createPane("leftPane").style.zIndex = 650;
    }

    if (swipeOpen && !map.getPane("rightPane")) {
      map.createPane("rightPane").style.zIndex = 650;
    }

    // Añadir GeoJSON completo al layer group de la izquierda (esto es para el render inicial)
    const newLeftLayer = L.geoJSON(geojsonData, {
      style: styleFeatureMainIndicator,
      onEachFeature: onEachFeature,
      pane: "leftPane",
    }).addTo(leftLayerGroup);

    // Añadir el layer group al mapa
    leftLayerGroup.addTo(map);

    setLeftLayerGroup(leftLayerGroup); // Actualizar el estado con el layer group

    if (swipeOpen) {
      const rightLayerGroup = L.layerGroup(); // Crear un nuevo layer group para la derecha
      const newRightLayer = L.geoJSON(geojsonData, {
        style: styleFeatureSecondIndicator,
        onEachFeature: onEachFeature,
        pane: "rightPane",
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

    // }, [geojsonData, currentIndicator, secondIndicator, swipeOpen, map, currentInfo.filter]);
  }, [
    geojsonData,
    currentIndicator,
    secondIndicator,
    swipeOpen,
    map,
    currentInfo.filter,
    userIndicatorPref,
    selectedPolygonLayer
  ]);

  useEffect(() => {
    // se oculta el poligono la poner la isocrona por culpa de este useEffect y de su dependencia con isocronas
    if (!geojsonData || currentInfo.filter?.barrio || currentInfo.isocronas)
      return;

    if (leftLayerGroup) {
      // Limpiar los LayerGroups actuales
      leftLayerGroup.clearLayers();
    }
    if (rightLayerGroup) {
      rightLayerGroup.clearLayers();
    }

    // Crear panes si aún no existen
    if (!map.getPane("leftPane")) {
      map.createPane("leftPane").style.zIndex = 650;
    }

    if (swipeOpen && !map.getPane("rightPane")) {
      map.createPane("rightPane").style.zIndex = 650;
    }

    // Añadir GeoJSON completo al layer group de la izquierda (esto es para el render inicial)
    const newLeftLayer = L.geoJSON(geojsonData, {
      style: styleFeatureMainIndicator,
      onEachFeature: onEachFeature,
      pane: "leftPane",
    }).addTo(leftLayerGroup);

    // Añadir el layer group al mapa
    leftLayerGroup.addTo(map);
    setLeftLayerGroup(leftLayerGroup); // Actualizar el estado con el layer group

    if (swipeOpen) {
      const rightLayerGroup = L.layerGroup(); // Crear un nuevo layer group para la derecha
      const newRightLayer = L.geoJSON(geojsonData, {
        style: styleFeatureSecondIndicator,
        onEachFeature: onEachFeature,
        pane: "rightPane",
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
  }, [
    geojsonData,
    currentIndicator,
    secondIndicator,
    swipeOpen,
    map,
    currentInfo.filter,
    currentInfo.isocronas,
    userIndicatorPref
  ]);

  return swipeOpen && leftLayerGroup && rightLayerGroup ? (
    <SwipeBar
      map={map}
      leftLayer={leftLayerGroup}
      rightLayer={rightLayerGroup}
    />
  ) : null;
};

export default PolygonManager;
