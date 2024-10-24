import { useEffect, useState, useContext } from "react";
import LeafletMapWithD3Overlay from "../components/LeafletMapWithD3Overlay.jsx";
import BaseMap from "../components/BaseMap.jsx";
import SidePanel from "../components/SidePanel.jsx";
import MapToolbar from "../components/MapToolBar.jsx";
import TopBar from "../components/TopBar.jsx";
import SidebarMenu from "@components/navigation/SidebarMenu.jsx";

import {
  getConfig,
  get_polygons,
  get_points,
  get_isocronas,
} from "../api/geo.js";
import ConfigContext from "../contexts/configContext.jsx";
import CurrentInfoContext from "../contexts/currentInfoContext.jsx";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import { inRange } from "../mixins/utils.js";
import { area } from "d3";

import { getCsrfToken } from "../api/geo.js";
import { getAreaIdsFromData } from "../mixins/utils.js";

function Dashboard() {
  const config = useContext(ConfigContext);
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);
  const { currentIndicator, setCurrentIndicator } = useContext(
    CurrentIndicatorContext
  );
  const [currentPolygonsType, setCurrentPolygonsType] = useState(null);
  const [loadedPolygons, setLoadedPolygons] = useState({});

  const [geodata, setGeoData] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(true);

  useEffect(() => {
    getCsrfToken().then((token) => {
      console.log("CSRF Token: ", token);
    });
  }, []);

  useEffect(() => {
    preloadPolygons(config.polygons).then((data) => {
      setLoadedPolygons(data);
      setCurrentPolygonsType(config.defaults.polygon);
      console.log("Polygons preloaded: ", data);
    });
  }, [config.polygons]);

  useEffect(() => {
    if (!currentPolygonsType) return;

    refreshPolygons(currentPolygonsType);
    let currentInfoCopy = { ...currentInfo };
    if (!config.polygons[currentPolygonsType].lazyLoading) {
      currentInfoCopy = {
        ...currentInfoCopy,
        area_ids: null,
      };
    }

    currentInfoCopy = {
      ...currentInfoCopy,
      area: currentPolygonsType,
    };

    setCurrentInfo(currentInfoCopy);

    console.log("Current polygons type: ", currentPolygonsType);
  }, [currentPolygonsType]);

  useEffect(() => {
    console.log("poligonos changed:", geodata);
  }, [geodata]);

  const handleUserMovedMap = (zoom, bounds) => {
    if (currentInfo?.isocronas) return; // Si hay isocronas, no hacer nada
    console.log("Zoom level: ", zoom);
    console.log("Bounds: ", bounds);
    Object.keys(config.polygons).forEach((key) => {
      const polygon = config.polygons[key];
      console.log("Polygon: ", polygon.zoomRange);
      if (inRange(zoom, polygon.zoomRange)) {
        if (currentPolygonsType === key && !polygon.lazyLoading) return;
        if (currentIndicator) {
          setCurrentInfo({ ...currentInfo, indicatorStatus: "loading" });
        }
        refreshPolygons(key, bounds).then(() => {
          setCurrentPolygonsType(key);
          console.log("Current polygons type: ", key);
          console.log("Polygons: ", geodata);
        });
      }
    });
  };

  const refreshPolygons = (type, bounds = null) => {
    return new Promise((resolve, reject) => {
      if (!type) return reject("Invalid type");
      let polygons = loadedPolygons[type];
      if (polygons) {
        console.log("Polygons already loaded: ", type);
        console.log(polygons);

        setGeoData({...geodata, polygons: polygons});

        return resolve();
      } else if (bounds) {
        console.log("Loading polygons: ", type);
        get_polygons(type, bounds)
          .then((data) => {
            const polygonsData = data;
            setGeoData({...geodata, polygons: polygonsData});
            let area_ids = getAreaIdsFromData(polygonsData.features);
            setCurrentInfo({ ...currentInfo, area_ids: area_ids });
            console.log("Polygons loaded: ", type);
            resolve();
          })
          .catch(reject);
      }
    });
  };

  const preloadPolygons = async (polygonsConfig) => {
    const promises = [];
    Object.keys(polygonsConfig).forEach((key) => {
      const polygon = polygonsConfig[key];
      if (!polygon.saveToCache) return;
      promises.push(
        get_polygons(key)
          .then((data) => ({ [key]: data }))
          .catch((error) => console.error(error))
      );

      console.log("Preloading polygons: ", key);
    });
    const results = await Promise.all(promises);

    return Object.assign({}, ...results);
  };

  const handlePolygonClick = (e) => {
    /*
    Devuelve la instrucción que tiene que hacer el PolygonManager cuando se hace click en un polígono en función de lo que decida esta vista (el Padre)
    Si devuelve null, el PolygonManager no hará nada
    si devuelve "hide", el PolygonManager eliminará todos los polígonos menos el que se ha clicado
    */
    const areaId = e.target.feature.properties.area_id;
    let instruction = null;
    if (
      currentIndicator &&
      currentInfo.time &&
      currentInfo.red &&
      currentInfo.user &&
      currentInfo.area &&
      config?.polygons?.[currentInfo.area].isocronas
    ) {
      instruction = "hide";
      get_isocronas(areaId, currentInfo.time, currentInfo.user, currentInfo.red).then((data) => {
        console.log("Isocronas: ", data);
        setGeoData({...geodata, isocronas: data.isocrona, locs: data.locs});
        setCurrentInfo({ ...currentInfo, isocronas: true });
      });
    }

    console.log("Area ID: ", e.target.feature.properties);

    return instruction;
  };

  const handleIsocronaClick = (e) => {
    console.log("Isocrona clicked: ", e);
    setCurrentInfo({ ...currentInfo, isocronas: false });
    setGeoData({...geodata, isocronas: null, locs: null});
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen">

      {/* <TopBar
        onMenuClick={() => {
          setOpenDrawer(!openDrawer);
          console.log(openDrawer);
        }}
      /> */}
      <div className="flex flex-1 relative">
        <SidebarMenu navbarHeight="0px" className="sidebar-menu" />
        <div className="flex-1 overflow-hidden map-container">
          {geodata && currentPolygonsType && (
            <BaseMap
              config={config}
              areasData={geodata}
              onPolygonClick={handlePolygonClick}
              onIsocronaClick={handleIsocronaClick}
              onUserMovedMap={handleUserMovedMap}
              viewInfo={config.polygons[currentPolygonsType]?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
