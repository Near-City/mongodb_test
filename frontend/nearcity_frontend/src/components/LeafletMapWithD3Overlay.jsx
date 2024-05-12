import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import * as d3 from 'd3';


const LeafletMapWithD3Overlay = ({ data }) => {
  const mapRef = useRef(null);
  const d3ContainerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return; // Si el mapa no está inicializado, no hacer nada

    const map = mapRef.current.leafletElement; // Accede al mapa de Leaflet
    const svgLayer = L.svg().addTo(map);
    const svg = d3.select(svgLayer._container);
    svg.attr('pointer-events', 'auto');

    // Define la proyección que alinea D3 con el mapa de Leaflet
    function projectPoint(x, y) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    // Añade tus elementos de D3 aquí, usando el `path` definido arriba
    // Asegúrate de actualizar estos elementos en respuesta a eventos de 'viewreset' y 'zoom' en Leaflet

    map.on('viewreset moveend', update);
    update();

    function update() {
      // Función para actualizar la visualización de D3 cuando cambia el mapa
    }

    return () => {
      map.off('viewreset moveend', update);
    };
  }, [data]); // Dependencias para recalcular en cambios de datos

  return (
    <MapContainer center={[39.46975, -0.37739]} zoom={13} style={{ height: '100vh' }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <div ref={d3ContainerRef}></div> {/* Contenedor para elementos D3 */}
    </MapContainer>
  );
};

export default LeafletMapWithD3Overlay;
