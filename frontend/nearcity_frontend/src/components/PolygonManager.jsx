import React, { useEffect, useRef, useContext } from "react";
import { useMap } from "react-leaflet";
import "leaflet-side-by-side";
import L from "leaflet";
import PolygonOverlay from "./PolygonOverlay";

import CurrentIndicatorContext from "@contexts/indicatorContext";

const PolygonManager = ({ geojsonData, swipeOpen }) => {
  const map = useMap();
  const overlayRef1 = useRef(null);
  const overlayRef2 = useRef(null);
  const { currentIndicator, setCurrentIndicator } = useContext(CurrentIndicatorContext);

  useEffect(() => {
    console.log(geojsonData)
  }, [geojsonData])

  useEffect(() => {
    
    // Crear paneles personalizados antes de añadir capas
    if (!map.getPane('leftPane')) {
      map.createPane('leftPane');
      map.getPane('leftPane').style.zIndex = 650; // Asegurar que el índice z sea correcto
    }

    if (!map.getPane('rightPane')) {
      map.createPane('rightPane');
      map.getPane('rightPane').style.zIndex = 650; // Asegurar que el índice z sea correcto
    }

    if (!geojsonData) return;

    const leftLayer = overlayRef1.current?.getLayer();
    const rightLayer = overlayRef2.current?.getLayer();

    if (leftLayer && rightLayer) {
      const sideBySideControl = L.control
        .sideBySide(leftLayer, rightLayer)
        .addTo(map);

      // Clean up the side-by-side control when the component unmounts or geojsonData changes
      return () => {
        map.removeControl(sideBySideControl);
      };
    }
  }, [geojsonData, map, swipeOpen]);

  return (
    <>
      <PolygonOverlay geojsonData={geojsonData} indicator={currentIndicator} pane="leftPane" ref={overlayRef1} />
      {swipeOpen && <PolygonOverlay geojsonData={geojsonData} indicator="K2" pane="rightPane" ref={overlayRef2} />}
    </>
  );
};

export default PolygonManager;
