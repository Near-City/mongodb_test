import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const MapToolTip = ({ data, x, y }) => {
  useEffect(() => {
    console.log('MapToolTip', data, x, y);
    
  }, [data, x, y]);
  return (
    <div
    className="tooltip absolute bg-white p-3 border border-gray-300 rounded shadow-xl text-xs z-10 transform -translate-x-1/2 -translate-y-full"
    style={{
      left: `${x + 70}px`, // +10 para un pequeño desplazamiento del cursor
      top: `${y + 5}px`,
      pointerEvents: 'none', // Para evitar que el tooltip interfiera con el mouseover
    }}
  >
    <div className="font-bold">{data.cod && (data?.cod?.N_DIST || data?.cod?.N_BAR)}</div>
    {data?.cod && Object.keys(data.KPIs).map((item, index) => (
      <div key={index}>
        {item}: {data.KPIs[item]}
      </div>
      ))}
  </div>
  );
};

MapToolTip.propTypes = {
  data: PropTypes.shape({
    cod: PropTypes.shape({
      N_DIST: PropTypes.string.isRequired,
      N_BAR: PropTypes.string.isRequired,
    }).isRequired,
    KPIs: PropTypes.object.isRequired,
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default MapToolTip;