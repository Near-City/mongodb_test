import React, { useEffect, useState, useContext } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { find_polygon_with_area_id } from "@mixins/utils";


const FilterManager = ({ config, geojsonData }) => {
  const map = useMap();
  const { currentInfo } = useContext(CurrentInfoContext);

  useEffect(() => {
    
    if (!geojsonData || !currentInfo.filter) return;
    if (currentInfo.filter.barrio){
        let area_id = currentInfo.filter.barrio;
        let polygon = find_polygon_with_area_id(geojsonData, area_id);
        if (!polygon) return;
        let bounds = L.geoJSON(polygon).getBounds();
        map.fitBounds(bounds);
    } else if (currentInfo.filter.calle){
        let bounds = L.geoJSON(geojsonData).getBounds();
        map.fitBounds(bounds);
    }
  }, [currentInfo.filter, geojsonData]);

  return null;
};

export default FilterManager;

