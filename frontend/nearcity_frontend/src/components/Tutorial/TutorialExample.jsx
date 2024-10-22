import React, { useState } from 'react';
import Joyride from 'react-joyride';

const TutorialExample = () => {
  // Tutorial configuration
  const [run, setRun] = useState(false); // Inicialmente el tutorial no está corriendo

  const steps = [
    {
      target: '#tutorial', // Identifica el contenedor del mapa
      content: 'Este es el menú donde podrás volver.',
      disableBeacon: true, // Desactiva el beacon (punto rojo)
    },
    {
      target: '#resourceSelector',
      content: 'Entra a este menú para seleccionar una combinación de recursos para mostrar un indicador.',
      disableBeacon: true,
    },
    {
      target: '#tile-selector',
      content: 'Aquí tienes un selector de capas, donde podrás cambiar entre la capa de satélite y un mapa base, además de alternar la visión del transporte público y demás.',
      disableBeacon: true,
    },
    {
      target: '#swipe',
      content: 'Permite comparar dos capas base del mapa. Puede deslizar la herramienta para ver el contenido de una u otra.',
      disableBeacon: true,
    },
  ];

  const handleStartTutorial = () => {
    setRun(true); // Ejecutar el tutorial al presionar el botón de "Iniciar Tutorial"
  };

  return (
    <div>
      <Joyride
        steps={steps}
        run={run}
        continuous={true} // Permite avanzar automáticamente de un paso a otro
        scrollToFirstStep={true} // Hace scroll automáticamente al primer paso si no está visible
        showProgress={true} // Muestra el progreso del tutorial
        showSkipButton={true} // Muestra un botón para saltar el tutorial
        disableOverlayClose={true} // Evita que el usuario cierre el tutorial haciendo clic fuera del tooltip
        spotlightClicks={true} // Permite clics en elementos durante el tutorial
        styles={{
          options: {
            zIndex: 10000, // Asegúrate de que los tooltips estén encima de todo
          },
        }}
        callback={(data) => {
          const { status } = data;
          if (status === 'finished' || status === 'skipped') {
            setRun(false); // Detiene el tutorial cuando se completa o se omite
          }
        }}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded m-4"
        onClick={handleStartTutorial}
      >
        Iniciar Tutorial
      </button>

      
    </div>
  );
};

export default TutorialExample;
