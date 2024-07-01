import { useEffect, useState, useContext } from "react";
import LeafletMapWithD3Overlay from "../components/LeafletMapWithD3Overlay.jsx";
import BaseMap from "../components/BaseMap.jsx";
import SidePanel from "../components/SidePanel.jsx";
import MapToolbar from "../components/MapToolBar.jsx";
import TopBar from "../components/TopBar.jsx";
import SidebarMenu from "@components/navigation/SidebarMenu.jsx";

import { getConfig, get_polygons, get_points } from "../api/geo.js";
import ConfigContext from "../contexts/configContext";
import CurrentInfoContext from "../contexts/currentInfoContext.jsx";
import { inRange } from "../mixins/utils.js";
import { area } from "d3";



function Test() {
  const config = useContext(ConfigContext);
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);

  const [activePanel, setActivePanel] = useState("home");
  const [barrios, setBarrios] = useState(null);
  const [distritos, setDistritos] = useState(null);
  const [secciones, setSecciones] = useState(null);
  const [parcelas, setParcelas] = useState(null);

  const [currentData, setCurrentData] = useState(null);
  const [currentPolygonsType, setCurrentPolygonsType] = useState(null);
  const [loadedPolygons, setLoadedPolygons] = useState({});

  const [polygons, setPolygons] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(true);

  // useEffect(() => {
  //   getCsrfToken().then((token) => {
  //     console.log("CSRF Token: ", token);
  //   });
  // }, []);

  useEffect(() => {
    preloadPolygons(config.polygons).then((data) => {
      setLoadedPolygons(data);
      setCurrentPolygonsType(config.defaults.polygon);
      console.log("Polygons preloaded: ", data);
    });
  }, [config.polygons]);

  /*
  Aquí hay un problema, se están renderizando los polígonos un frame después de hacer el zoom y que se renderice el mapa, lo que da un efecto de parpadeo.
  */
  useEffect(() => {
    if (!currentPolygonsType) return;
    refreshPolygons(currentPolygonsType);
    setCurrentInfo({ ...currentInfo, area: currentPolygonsType});
    console.log("Current polygons type: ", currentPolygonsType);
    
  }, [currentPolygonsType]);

  useEffect(() => {
    console.log("poligonos changed:", polygons)
  }, [polygons]);

  const handleUserMovedMap = (zoom, bounds) => {
    console.log("Zoom level: ", zoom);
    console.log("Bounds: ", bounds);
    Object.keys(config.polygons).forEach((key) => {
      const polygon = config.polygons[key];
      console.log("Polygon: ", polygon.zoomRange);
      if (inRange(zoom, polygon.zoomRange)) {
        if (currentPolygonsType === key && !polygon.lazyLoading) return; // No need to refresh, already loaded
        refreshPolygons(key, bounds).then(() => {
          setCurrentPolygonsType(key);
          console.log("Current polygons type: ", key);
          console.log("Polygons: ", polygons);
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
        setPolygons(polygons);
        return resolve();
      } else if (bounds) {
        console.log("Loading polygons: ", type);
        setCurrentInfo({ ...currentInfo, areaLoading: true});
        get_polygons(type, bounds)
          .then((data) => {
            const polygonsData = data;
            // NO guardamos los polígonos en el estado, solo los mostramos
            // setLoadedPolygons((prev) => ({ ...prev, [type]: polygonsData }));
            
            setPolygons(polygonsData);
            setCurrentInfo({ ...currentInfo, areaLoading: false});
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

  const onDataRequested = (id) => {
    console.log("Data requested: ", id);

    if (id === "distritos") {
      if (!distritos) updateDistritos();
      setCurrentData(distritos);
    } else if (id === "barrios") {
      if (!barrios) updateBarrios();
      setCurrentData(barrios);
    } else if (id === "secciones") {
      if (!secciones) updateSecciones();
      setCurrentData(secciones);
    } else if (id === "parcelas") {
      // setCurrentData(parcelas);
    }
  };

  // Sacar los datos de la API sobre las PARCELAS
  // useEffect(() => {
  //   getParcelas().then((data) => {
  //     // data.title = "Parcelas";
  //     if (data.length == 0) return;
  //     data = data[0];
  //     console.log(data);

  //   });
  // }, []);

  function filterByName(data, name) {
    return data.filter((item) => {
      if (item.cod.hasOwnProperty("N_DIST")) {
        return item.cod.N_DIST === name;
      } else if (item.cod.hasOwnProperty("N_BAR")) {
        return item.cod.N_BAR === name;
      } else {
        return false;
      }
    });
  }

  function filter(name) {
    console.log(name);
    console.log(barrios);
    // setDinamicBarrios(filterByName(barrios, name));
    // setDinamicDistritos(filterByName(distritos, name));
    // setDinamicSecciones(filterByName(secciones, name));
  }

  if (!config) return <div>Loading...</div>;
  return (
    <div className="flex flex-col h-screen ">
      <TopBar
        onMenuClick={() => {
          setOpenDrawer(!openDrawer);
          console.log(openDrawer);
        }}
      />
      <div className="flex flex-1 relative">
        <SidebarMenu navbarHeight="64px" />
        <div className="flex-1 overflow-hidden">
          {polygons && currentPolygonsType && (
            <BaseMap
              areasData={polygons}
              requestData={onDataRequested}
              onUserMovedMap={handleUserMovedMap}
              viewInfo={config.polygons[currentPolygonsType]?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
