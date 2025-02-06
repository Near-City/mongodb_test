import React from 'react';
import Joyride from 'react-joyride';

const TutorialExample = ({ run, setRun }) => {
  const steps = [
    {
      target: '#tutorial',
      content: 'Este es el menú donde podrás volver.',
      disableBeacon: true,
    },
    {
      target: '#swipe',
      content: 'Permite comparar dos capas base del mapa. Puede deslizar la herramienta para ver el contenido de una u otra.',
      disableBeacon: true,
    },
    {
      target: '#hide-indicators',
      content: 'Este botón te permite ocultar el selector de indicadores.',
      disableBeacon: true,
    },
    {
      target: '#tile-selector',
      content: 'Aquí tienes un selector de capas, donde podrás cambiar entre la capa de satélite y un mapa base, además de alternar la visión del transporte público y demás.',
      disableBeacon: true,
    },
    {
      target: '#indicator-selectors',
      content: 'En este panel podrás seleccionar el indicador que desees visualizar.',
      disableBeacon: true,
    }
  ];

  return (
    <div>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        disableOverlayClose={true}
        spotlightClicks={true}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
        callback={(data) => {
          const { status } = data;
          if (status === 'finished' || status === 'skipped') {
            setRun(false);
          }
        }}
      />
    </div>
  );
};

export default TutorialExample;
