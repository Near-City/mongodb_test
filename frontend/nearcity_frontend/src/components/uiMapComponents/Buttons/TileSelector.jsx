import React, { useState } from 'react';

const TileSelector = ({ onClick, isSatellite }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="absolute bottom-4 left-6 z-[999]">
      {/* Contenedor que engloba tanto el botón como el menú */}
      <div
        className="relative flex flex-col items-start"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        {/* Botón principal */}
        <button
          className={`w-24 h-24 rounded-md shadow-lg bg-cover bg-center transition duration-300 hover:scale-105 flex flex-col justify-end items-center ${
            isSatellite ? 'bg-satellite-image' : 'bg-map-image'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span className="text-white font-semibold text-sm bg-black bg-opacity-50 px-2 py-1 rounded-md mb-1">
            {isSatellite ? 'Satélite' : 'Mapa'}
          </span>
        </button>

        {/* Área de transición invisible */}
        <div className="h-2"></div> {/* Espacio vertical entre botón y menú */}

        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-md mt-2">
            {/* Opciones del menú */}
            <button className="w-24 h-24 bg-relief-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700">
              Relieve
            </button>
            <button className="w-24 h-24 bg-traffic-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700">
              Tráfico
            </button>
            <button className="w-24 h-24 bg-transit-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700">
              Transporte público
            </button>
            <button className="w-24 h-24 bg-bike-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700">
              En bicicleta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TileSelector;
