import React, { useEffect, useRef, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentInfoContext from "@contexts/currentInfoContext";

const FilterManager = ({ config, geojsonData }) => {
  const map = useMap();
  const { currentInfo } = useContext(CurrentInfoContext);
  const prevFilterRef = useRef(null);

  useEffect(() => {
    const prevFilter = prevFilterRef.current;
    const currentFilter = currentInfo.filter;

    // Guardar el filtro actual para el próximo render
    prevFilterRef.current = currentFilter;

    if (!geojsonData) return;

    const hadFilter =
      prevFilter &&
      (prevFilter.calle || prevFilter.barrio || prevFilter.distrito);
    const hasFilter =
      currentFilter &&
      (currentFilter.calle || currentFilter.barrio || currentFilter.distrito);

    if (hasFilter) {
      // Filtro activo → enfocar el mapa a los datos
      const bounds = L.geoJSON(geojsonData).getBounds();
      map.fitBounds(bounds);
    } else if (hadFilter && !hasFilter) {
      console.log("Desactivando filtro");
      // Filtro se acaba de desactivar → mover un poco el mapa para refrescar
      setTimeout(() => {
        const center = map.getCenter();
        map.panTo([center.lat + 0.00001, center.lng + 0.00001]); // pequeño "empujón"
      }, 100); // TODO: ESTO ES CUTRE, PERO NO ENCUENTRO OTRA FORMA DE HACERLO

      // const bounds = L.geoJSON(geojsonData).getBounds();
      // map.fitBounds(bounds);
    }
  }, [currentInfo.filter, geojsonData]);

  return null;
};

export default FilterManager;
