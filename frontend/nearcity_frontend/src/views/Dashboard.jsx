import { useEffect, useState, useContext, useCallback } from "react";
import LeafletMapWithD3Overlay from "../components/LeafletMapWithD3Overlay.jsx";
import BaseMap from "../components/BaseMap.jsx";
import SidePanel from "../components/SidePanel.jsx";
import MapToolbar from "../components/MapToolBar.jsx";
import TopBar from "../components/TopBar.jsx";
import SidebarMenu from "@components/navigation/SidebarMenu.jsx";

import IndicatorsManager from "@components/IndicatorsManager.jsx";

import {
  get_polygons,
  get_isocronas,
  get_carril_bici,
  get_search,
  get_locs
} from "../api/geo.js";
import ConfigContext from "../contexts/configContext.jsx";
import CurrentInfoContext from "../contexts/currentInfoContext.jsx";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import { inRange } from "../mixins/utils.js";

import { getCsrfToken } from "../api/geo.js";
import { getAreaIdsFromData } from "../mixins/utils.js";
import { filter } from "d3";

function Dashboard() {
  const config = useContext(ConfigContext);
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);
  const { currentIndicator, setCurrentIndicator } = useContext(
    CurrentIndicatorContext
  );
  const [currentPolygonsType, setCurrentPolygonsType] = useState(null);
  const [loadedPolygons, setLoadedPolygons] = useState({});

  const [geodata, setGeoData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(true);

  useEffect(() => {
    getCsrfToken().then((token) => {
      console.log("CSRF Token: ", token);
    });
  }, []);

  useEffect(() => {
    if (!config) return;
    preloadPolygons(config.polygons).then((data) => {
      setLoadedPolygons(data);
      setCurrentPolygonsType(config.defaults.polygon);
      console.log("Polygons preloaded: ", data);
    });

    get_carril_bici().then((data) => {
      console.log("Carril bici: ", data);
      setGeoData((prevGeoData) => ({
        ...(prevGeoData || {}), // Si geodata no existe, crea un objeto vacío
        extra: {
          ...(prevGeoData?.extra || {}), // Si extra no existe, crea un objeto vacío
          carril_bici: data, // Añade o actualiza la propiedad carril_bici
        },
      }));
      console.log("Carril bici loaded: ", data);
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
    console.log(currentInfo)
    if (currentInfo?.isocronas || currentInfo?.filter) return; // Si hay isocronas o hay un filtro activo, no hacer nada
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

        setGeoData({ ...geodata, polygons: polygons });

        return resolve();
      } else if (bounds) {
        console.log("Loading polygons: ", type);
        get_polygons(type, bounds)
          .then((data) => {
            const polygonsData = data;
            setGeoData({ ...geodata, polygons: polygonsData });
            let area_ids = getAreaIdsFromData(polygonsData.features);
            setCurrentInfo({ ...currentInfo, area_ids: area_ids });
            console.log("Polygons loaded: ", type);
            resolve();
          })
          .catch(reject);
          // para renderizar los locs (no acabado)
          // if (currentInfo?.indicators?.primary?.resource){
          //   get_locs(currentInfo?.indicators?.primary?.resource, bounds).then((data) => {
          //     console.log("Locs loaded: ", data);
          //     setGeoData({ ...geodata, locs: data });
          //   });
          // }
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
      currentInfo.indicators.primary.time &&
      currentInfo.indicators.primary.red &&
      currentInfo.indicators.primary.user &&
      currentInfo.area &&
      config?.polygons?.[currentInfo.area].isocronas
    ) {
      instruction = "hide";
      get_isocronas(
        areaId,
        currentInfo.indicators.primary.time,
        currentInfo.indicators.primary.user,
        currentInfo.indicators.primary.red
      ).then((data) => {
        let resource_name = config.schema.labels.locs[currentInfo.indicators.primary.resource].toLowerCase()
        let time_name = config.schema.labels.time[currentInfo.indicators.primary.time].toLowerCase()
        let red_name = config.schema.labels.red[currentInfo.indicators.primary.red].toLowerCase()
        console.log(currentInfo)
        let info_text = `Visualizando la Isocrona de ${resource_name} a ${time_name} en la red ${red_name}`;
        setCurrentInfo({ ...currentInfo, isocronas: true, viewInfo: {
          text: info_text,
          onClose: hideIsocronas
        } });
        setGeoData({ ...geodata, isocronas: data.isocrona, locs: data.locs });
      });
    } else if (currentInfo.filter) {
      // Si hay un filtro activo, desactivarlo -> SOLUCION TEMPORAL
      setCurrentInfo({ ...currentInfo, filter: null, viewInfo: null });
    }

    console.log("Area ID: ", e.target.feature.properties);

    return instruction;
  };

  const handleIsocronaClick = (e) => {
    console.log("Isocrona clicked: ", e);
    hideIsocronas();
  };

  const hideIsocronas = () => {
    setCurrentInfo({ ...currentInfo, viewInfo: null, isocronas: false });
    setGeoData({ ...geodata, isocronas: null, locs: null });
  };



  const handleSearch = useCallback((searchTerm) => {
    console.log("Search term: ", searchTerm);
    get_search(searchTerm).then((data) => {
      console.log("Search results: ", data);
      setSearchResults(data);
      // setGeoData({ ...geodata, searchResults: data });
    });
  }, []);

  const handleSearchResultClick = (result) => {
    console.log("Search result clicked: ", result);
    let viewInfo = {
      text: `Visualizando ${result.type} ${result.name}`,
      onClose: () => {
        setCurrentInfo({ ...currentInfo, viewInfo: null });
      },
    }
    if (result.type === "barrio") {
      console.log("Barrio clicked: ", result);
      let id = result.id;
      setCurrentInfo({ ...currentInfo, filter: { barrio: id }, viewInfo: viewInfo });
      setCurrentPolygonsType("B");
    } else if (result.type === "calle" || result.type === "parcela") {
      console.log("Calle clicked: ", result);
      let name = result.name;
      setCurrentInfo({ ...currentInfo, filter: { calle: name }, viewInfo: viewInfo });
      let parcelas = result.parcelas
      if (parcelas){
        console.log("Parcelas: ", parcelas);
        let featureCollection = {
          type: "FeatureCollection",
          features: parcelas
        }
        setGeoData({ ...geodata, polygons: featureCollection });
        setCurrentPolygonsType("PC");
      }
    } 
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
      <IndicatorsManager />
      <div className="flex flex-1 relative">
        {/* <SidebarMenu navbarHeight="0px" className="sidebar-menu"/> */}
        <div className="flex-1 overflow-hidden map-container">
          {geodata && currentPolygonsType && (
            <BaseMap
              config={config}
              areasData={geodata}
              onPolygonClick={handlePolygonClick}
              onIsocronaClick={handleIsocronaClick}
              onUserMovedMap={handleUserMovedMap}
              handleSearch={handleSearch}
              searchResults={searchResults}
              onResultClick={handleSearchResultClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
