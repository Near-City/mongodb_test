import React, { useState, useEffect, useRef, useContext } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import PolygonOverlay from "./PolygonOverlay";
import valenciaBounds from "../data/geojson/valencia_boundary.json";
import ButtonGroup from "./uiMapComponents/uiModels/ButtonGroup.jsx";
import swipeIcon from "../assets/icons/swipeIcon.png";

import SwipeMenu from "./uiMapComponents/DraggableMenus/SwipeMenu.jsx";
import ViewInfoBar from "./uiMapComponents/FloatingBars/ViewInfoBar.jsx";
import PolygonManager from "./PolygonManager";
import TileSelector from "./uiMapComponents/Buttons/TileSelector";
import IsocronasManager from "./IsocronasManager";
import LocsManager from "./LocsManager";
import ExtraManager from "./ExtraManager";
import DebouncedSearchBar from "./uiMapComponents/SearchBars/DebouncedSearchBar";
import FilterManager from "./FilterManager";
import ConfigContext from "../contexts/configContext";
import IndicatorSelector from "./uiMapComponents/uiModels/IndicatorSelector";
import TutorialExample from "@components/Tutorial/TutorialExample.jsx";
import { FaQuestion, FaBuilding } from "react-icons/fa";
import { BiHide, BiShow } from "react-icons/bi";

const MapBounds = () => {
  const map = useMap();
  useEffect(() => {
    // const bounds = L.geoJSON(valenciaBounds).getBounds();
    // map.fitBounds(bounds);
    // map.setMaxBounds(bounds);
    map.setMinZoom(9);
  }, [map]);
  return null;
};

const DynamicDataHandler = ({ onUserMovedMap }) => {
  const config = useContext(ConfigContext);

  const map = useMap();
  useEffect(() => {
    const handleMoveEnd = async () => {
      console.log("Map moved");
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      const coords = bounds.toBBoxString().split(",");
      if (coords?.length !== 4) return;
      const minX = parseFloat(coords[0]);
      const minY = parseFloat(coords[1]);
      const maxX = parseFloat(coords[2]);
      const maxY = parseFloat(coords[3]);
      console.log(minX, minY, maxX, maxY);
      const mapBounds = { north: maxY, south: minY, east: maxX, west: minX };
      onUserMovedMap(zoom, mapBounds);
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, onUserMovedMap]);

  return null;
};

const BaseMap = ({
  config,
  areasData,
  onPolygonClick,
  onIsocronaClick,
  onUserMovedMap,
  handleSearch,
  searchResults,
  onResultClick,
  showLocs, setShowLocs
}) => {
  const [swipeMenuOpen, setSwipeMenuOpen] = useState(false);
  const [map, setMap] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [activeExtraButtons, setActiveExtraButtons] = useState({
    relieve: false,
    trafico: false,
    transito: false,
    carril_bici: false,
  });
  const [tutorial, setTutorial] = useState(false);
  const [hideIndicatorSelectors, setHideIndicatorSelectors] = useState(false);
  const [selectedTimeElementPrimary, setSelectedTimeElementPrimary] =
    useState(null);
  const [selectedTimeElementSecondary, setSelectedTimeElementSecondary] =
    useState(null);

    const [selectedLocElementPrimary, setSelectedLocElementPrimary] = useState(null);
    const [selectedLocElementSecondary, setSelectedLocElementSecondary] = useState(null);

  // useEffect para añadir las capas después de que el mapa está disponible
  useEffect(() => {
    if (map) {
      console.log("Hay mapa");
      // Define las capas de mapa base y satélite
      const baseLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }
      );

      // Guarda las capas en el objeto de mapa para poder acceder a ellas más tarde
      map.baseLayer = baseLayer;
      map.satelliteLayer = satelliteLayer;
      // Añade la capa base por defecto
      baseLayer.addTo(map);
    }
  }, [map]); // Este useEffect solo se ejecuta cuando mapRef.current está definido

  const handleSwipeMenuToggle = () => {
    setSwipeMenuOpen(!swipeMenuOpen);
  };

  const toggleLayer = () => {
    if (map) {
      if (isSatellite) {
        // Verifica que satelliteLayer esté definido antes de intentar eliminarlo
        if (map.satelliteLayer) {
          map.removeLayer(map.satelliteLayer);
        }
        if (map.baseLayer) {
          map.baseLayer.addTo(map);
        }
      } else {
        // Verifica que baseLayer esté definido antes de intentar eliminarlo
        if (map.baseLayer) {
          map.removeLayer(map.baseLayer);
        }
        if (map.satelliteLayer) {
          map.satelliteLayer.addTo(map);
        }
      }
      setIsSatellite(!isSatellite); // Cambia el estado de la capa
    }
  };

  const topLeftButtons = [
    {
      icon: <FaQuestion className="text-white" />,
      onClick: () => setTutorial(true),
      id: "tutorial",
    },
    {
      icon: swipeIcon,
      onClick: () => handleSwipeMenuToggle(),
      id: "swipe",
    },
    {
      icon: hideIndicatorSelectors ? (
        <BiShow className="text-white" />
      ) : (
        <BiHide className="text-white" />
      ),
      onClick: () => setHideIndicatorSelectors(!hideIndicatorSelectors),
      id: "hide-indicators",
    },
    {
      icon: showLocs ? (
        <FaBuilding className="text-white" />
      ) : (
        <FaBuilding className="text-gray-500" />
      ),
      onClick: () => setShowLocs(!showLocs),
      id: "show-locs",
    },
  ];

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[39.46975, -0.37739]}
        zoom={12}
        style={{ height: "100%", width: "100%", position: "relative" }}
        ref={setMap}
      >
        <TutorialExample run={tutorial} setRun={setTutorial} />
        <GeoJSON data={areasData?.polygons} style={{ color: "white" }} />
        <PolygonManager
          config={config}
          geojsonData={areasData?.polygons}
          swipeOpen={swipeMenuOpen}
          onPolygonClick={onPolygonClick}
        />
        <IsocronasManager
          config={config}
          geojsonData={areasData?.isocronas}
          onPolygonClick={onIsocronaClick}
        />
        <FilterManager config={config} geojsonData={areasData?.polygons} />
        {showLocs && <LocsManager config={config} geojsonData={areasData?.locs} />}
        <ExtraManager
          config={config}
          geojsonData={areasData?.extra}
          activeExtra={activeExtraButtons}
        />
        <DynamicDataHandler onUserMovedMap={onUserMovedMap} />
        <MapBounds />
      </MapContainer>
      <div
        id="map-overlay"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="relative w-full h-full pointer-events-auto">
          <ViewInfoBar />
          <ButtonGroup buttonsInfo={topLeftButtons} />
          <div className={` 
          transition-all duration-100 
          ${hideIndicatorSelectors ? 'opacity-0  pointer-events-none':'opacity-100 '}
        `}
 >
            {swipeMenuOpen ? (
              <>
                <IndicatorSelector
                  position="left-center"
                  layout="column"
                  indicatorName="primary"
                  startAngle={-40}
                  rotationAngle={90}
                  radius={9}
                  selectedTimeElement={selectedTimeElementPrimary}
                  setSelectedTimeElement={setSelectedTimeElementPrimary}
                  selectedLocElement={selectedLocElementPrimary}
                  setSelectedLocElement={setSelectedLocElementPrimary}
                />
                <IndicatorSelector
                  position="right-center"
                  layout="column"
                  indicatorName="secondary"
                  startAngle={140}
                  rotationAngle={90}
                  radius={9}
                  selectedTimeElement={selectedTimeElementSecondary}
                  setSelectedTimeElement={setSelectedTimeElementSecondary}
                  selectedLocElement={selectedLocElementSecondary}
                  setSelectedLocElement={setSelectedLocElementSecondary}
                />
              </>
            ) : (
              <IndicatorSelector
                position="bottom-center"
                layout="row"
                selectedTimeElement={selectedTimeElementPrimary}
                setSelectedTimeElement={setSelectedTimeElementPrimary}
                selectedLocElement={selectedLocElementPrimary}
                setSelectedLocElement={setSelectedLocElementPrimary}
              />
            )}
          </div>

          <TileSelector
            isSatellite={isSatellite}
            onClick={toggleLayer}
            activeExtraButtons={activeExtraButtons}
            setActiveExtraButtons={setActiveExtraButtons}
          />
          <DebouncedSearchBar
            onSearch={handleSearch}
            results={searchResults}
            onResultClick={onResultClick}
          />
        </div>
      </div>
    </div>
  );
};

export default BaseMap;
