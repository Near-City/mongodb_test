import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import PolygonOverlay from './PolygonOverlay';
import valenciaBounds from '../data/geojson/valencia_boundary.json';

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

const ZoomDataHandler = ({requestData}) => {
  const map = useMap();
  const handleZoomLevel = (zoom) => {
    
    const distritos_zoom = [12, 13];
    const barrios_zoom = [14, 15];
    const secciones_zoom = [16, 17];
    const parcelas_zoom = [18, 19];

    if (zoom >= distritos_zoom[0] && zoom < distritos_zoom[1]) {
      requestData('distritos');
    } else if (zoom >= barrios_zoom[0] && zoom < barrios_zoom[1]) {
      requestData('barrios');
    }
    else if (zoom >= secciones_zoom[0] && zoom < secciones_zoom[1]) {
      requestData('secciones');
    } else if (zoom >= parcelas_zoom[0] && zoom < parcelas_zoom[1]) {
      requestData('parcelas');
    }
  }
  useEffect(() => {
    map.on('zoomend', () => {
      const zoom = map.getZoom();
      handleZoomLevel(zoom);
    });
  }, [map]);
  return null;
}


const BaseMap = ({ geojsonData, requestData }) => {

  return (
    <MapContainer center={[39.46975, -0.37739]} zoom={12} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={valenciaBounds} style={{ color: 'blue' }} />
      <MapBounds />
      <PolygonOverlay geojsonData={geojsonData} />
      <ZoomDataHandler requestData={requestData} />
    </MapContainer>
  );
};

export default BaseMap;
