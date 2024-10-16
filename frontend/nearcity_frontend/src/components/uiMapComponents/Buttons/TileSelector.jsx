import React, { useState } from 'react';

const TileSelector = ({ onClick, isSatellite }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeButtons, setActiveButtons] = useState({
    relief: false,
    traffic: false,
    transit: false,
    bike: false,
  });

  const handleMenuButtonClick = (buttonKey) => {
    setActiveButtons((prev) => ({
      ...prev,
      [buttonKey]: !prev[buttonKey],
    }));
  };

  return (
    <div className="absolute bottom-4 left-6 z-[999]">
      {/* Contenedor que engloba tanto el botón como el menú */}
      <div
        className="relative flex flex-row items-center"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        {/* Botón principal */}
        <button
          className={`w-24 h-24 rounded-md shadow-lg bg-cover bg-center transition duration-300 hover:scale-105 hover:border-2 hover:border-black flex flex-col justify-end items-center ${
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
        <div className="w-2"></div> {/* Espacio horizontal entre botón y menú */}

        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="flex flex-row gap-2 bg-white p-3 rounded-lg shadow-md ml-2">
            {/* Opciones del menú */}
            <button
              className={`w-20 h-20 bg-transit-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700 transition duration-300 transform hover:scale-105 active:scale-95 ${
                activeButtons.transit ? 'border-2 border-blue-400' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuButtonClick('transit');
              }}
            >
              Transporte público
            </button>
            <button
              className={`w-20 h-20 bg-relief-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700 transition duration-300 transform hover:scale-105 active:scale-95 ${
                activeButtons.relief ? 'border-2 border-blue-400' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuButtonClick('relief');
              }}
            >
              Relieve
            </button>
            <button
              className={`w-20 h-20 bg-traffic-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700 transition duration-300 transform hover:scale-105 active:scale-95 ${
                activeButtons.traffic ? 'border-2 border-blue-400' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuButtonClick('traffic');
              }}
            >
              Tráfico
            </button>
            <button
              className={`w-20 h-20 bg-bike-image bg-cover bg-center rounded-md flex flex-col items-center justify-end text-xs font-semibold text-gray-700 transition duration-300 transform hover:scale-105 active:scale-95 ${
                activeButtons.bike ? 'border-2 border-blue-400' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuButtonClick('bike');
              }}
            >
              En bicicleta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TileSelector;