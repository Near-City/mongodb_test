import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import PolygonOverlay from "./PolygonOverlay";
import valenciaBounds from "../data/geojson/valencia_boundary.json";
import ButtonGroup from "./uiMapComponents/uiModels/ButtonGroup.jsx";
import { Bars2Icon } from '@heroicons/react/24/solid'

import SwipeMenu from "./uiMapComponents/DraggableMenus/SwipeMenu.jsx";
import ViewInfoBar from "./uiMapComponents/FloatingBars/ViewInfoBar.jsx";
import PolygonManager from "./PolygonManager";

const MapBounds = () => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(valenciaBounds).getBounds();
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    map.setMinZoom(map.getZoom());
  }, [map]);
  return null;
};
const distritos_zoom = [10, 12];
const barrios_zoom = [13, 14];
const secciones_zoom = [15, 17];
const parcelas_zoom = [18, 19];
const ZoomDataHandler = ({ requestData }) => {
  const map = useMap();
  const handleZoomLevel = (zoom) => {
    console.log("Zoom level: ", zoom);


    if (zoom >= distritos_zoom[0] && zoom <= distritos_zoom[1]) {
      requestData("distritos");
    } else if (zoom >= barrios_zoom[0] && zoom <= barrios_zoom[1]) {
      requestData("barrios");
    } else if (zoom >= secciones_zoom[0] && zoom <= secciones_zoom[1]) {
      requestData("secciones");
    } else if (zoom >= parcelas_zoom[0] && zoom <= parcelas_zoom[1]) {
      requestData("parcelas");
    }
  };
  useEffect(() => {
    map.on("zoomend", () => {
      const zoom = map.getZoom();
      handleZoomLevel(zoom);
    });
  }, [map]);
  return null;
};

const BaseMap = ({ geojsonData, requestData }) => {
  const [swipeMenuOpen, setSwipeMenuOpen] = useState(false);
  const [viewInfo, setViewInfo] = useState(null);

  const overlayRef1 = useRef(null);
  const overlayRef2 = useRef(null);


  useEffect(() => {
    if (geojsonData.title){
      const info = {
        title: geojsonData.title,
      }
      setViewInfo(info);
    }
  }, [geojsonData]);
  
  const handleSwipeMenuToggle = () => {
    setSwipeMenuOpen(!swipeMenuOpen);
  }

  const bottomButtons = [
    {
      icon: "icon1",
      onClick: () => handleSwipeMenuToggle(),
    },
    {
      icon: "icon2",
      onClick: () => console.log("icon2"),
    },
    {
      icon: "icon3",
      onClick: () => console.log("icon3"),
    },
  ];

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[39.46975, -0.37739]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={geojsonData} style={{ color: "blue" }} />
        <PolygonManager geojsonData={geojsonData} swipeOpen={swipeMenuOpen}/>
        <ZoomDataHandler requestData={requestData} />
      </MapContainer>
      <div id="map-overlay" className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <ViewInfoBar viewInfo={viewInfo}/>
          <ButtonGroup buttonsInfo={bottomButtons} />
          <SwipeMenu isMenuOpen={swipeMenuOpen} onMenuToggle={handleSwipeMenuToggle}/>
        </div>
      </div>
    </div>
  );
};

export default BaseMap;

