import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import L from 'leaflet';

const MapView = () => {
    const position = [39.46975, -0.37739]; // Coordenadas de Valencia
    const mapStyle = { height: "100vh", width: "100%" };

    // Define los puntos de tu polígono (ejemplo genérico)
    const polygon = [
        [39.47049, -0.37634],
        [39.47169, -0.37846],
        [39.47011, -0.37984],
        [39.46930, -0.37782]
    ];

    return (
        <MapContainer center={position} zoom={13} style={mapStyle}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polygon pathOptions={{ color: 'blue' }} positions={polygon} />
        </MapContainer>
    );
};

export default MapView;
