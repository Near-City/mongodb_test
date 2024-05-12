import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import * as d3 from 'd3';

const PolygonOverlay = ({ geojsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (!geojsonData) return;

    const svgLayer = L.svg({ interactive: true }).addTo(map); // Asegúrate de que el SVG permite interacción
    const svg = d3.select(svgLayer._container).select('g').attr('class', 'leaflet-zoom-hide'); // Usa 'g' para agrupar polígonos

    // Define la función de proyección para transformar las coordenadas geográficas a puntos en el mapa
    const projectPoint = function(x, y) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    // Añade los elementos del GeoJSON al grupo SVG
    const feature = svg.selectAll("path")
      .data(geojsonData.features)
      .join("path")
        .attr("d", path)
        .attr("fill", "#3366cc") // Color de relleno
        .attr("stroke", "#fff")  // Color del borde
        .attr("stroke-width", 1);

    // Actualiza el path cuando el mapa cambia de zoom o posición
    const update = () => {
      feature.attr("d", path);
    };

    map.on('zoomend viewreset moveend', update); // Escucha los eventos de cambio de zoom y posición

    return () => {
      map.off('zoomend viewreset moveend', update); // Limpia los eventos al desmontar
      svgLayer.remove(); // Elimina la capa SVG
    };
  }, [geojsonData, map]); // Reactiva el efecto cuando geojsonData o map cambian

  return null;
};

export default PolygonOverlay;
