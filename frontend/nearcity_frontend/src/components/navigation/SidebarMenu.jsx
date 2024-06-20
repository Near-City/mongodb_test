// Sidebar.jsx
import React, { useState } from 'react';
import { FiInfo, FiGlobe, FiList, FiLayers, FiGrid, FiBarChart2 } from 'react-icons/fi';
import { GrResources } from "react-icons/gr";
import ResourceSelector from '@components/SideBarPages/ResourceSelector';

const Sidebar = ({ navbarHeight = '10px' }) => {
  const [activePanel, setActivePanel] = useState(null);

  const data = [
    { icon: FiInfo, label: 'Tutorial'},
    { icon: GrResources, label: 'Selección de Recurso', component: ResourceSelector },
    { icon: FiList, label: 'List' },
    { icon: FiLayers, label: 'Layers' },
    { icon: FiGrid, label: 'Grid' },
    { icon: FiBarChart2, label: 'Chart' },
  ];

  const togglePanel = (index) => {
    setActivePanel(activePanel === index ? null : index);
  };

  return (
    <>
      {/* Barra de iconos */}
      <div className="w-16 bg-gray-800 h-full flex flex-col items-center py-4 z-10">
        {data.map((item, index) => (
          <button
            key={index}
            className={`p-3 mb-4 rounded-full hover:bg-gray-700 transition-colors ${
              activePanel === index ? 'bg-blue-500' : ''
            }`}
            onClick={() => togglePanel(index)}
          >
            <item.icon className="text-white text-2xl" />
          </button>
        ))}
      </div>

      {/* Panel desplegable */}
      {activePanel !== null && (
        <div 
          className="w-auto min-w-64 bg-white shadow-lg fixed left-16 h-full overflow-y-auto z-[9999] transition-all duration-300 ease-in-out"
          style={{top: navbarHeight}}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{data[activePanel].label}</h2>
            {/* Corrección aquí: Asignar el componente a una variable y luego usarlo */}
            {data[activePanel].component && React.createElement(data[activePanel].component)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;