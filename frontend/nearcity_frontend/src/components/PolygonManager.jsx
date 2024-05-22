import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "leaflet-side-by-side";
import L from "leaflet";
import PolygonOverlay from "./PolygonOverlay";

const PolygonManager = ({ geojsonData, swipeOpen }) => {
  const map = useMap();
  const overlayRef1 = useRef(null);
  const overlayRef2 = useRef(null);

  useEffect(() => {
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
      <PolygonOverlay geojsonData={geojsonData} indicator="K1" ref={overlayRef1} />
      {swipeOpen && <PolygonOverlay geojsonData={geojsonData} indicator="K2" ref={overlayRef2} />}
    </>
  );
};

export default PolygonManager;
