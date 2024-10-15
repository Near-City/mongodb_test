import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

let mapWasDragEnabled = false;
let mapWasTapEnabled = false;

const SwipeBar = ({ map, leftLayer, rightLayer }) => {
  const [position, setPosition] = useState(window.innerWidth / 2);
  const swipeRef = useRef(null);

  useEffect(() => {
    // Update the initial position to be centered when the component is mounted
    setPosition(window.innerWidth / 2);

    return () => {
      // devolver los paneles a su estado original
      map.getPane("leftPane").style.clip = "auto";
    };
  }, []);

  const updateClip = () => {
    if (!leftLayer || !rightLayer) return;

    const nw = map.containerPointToLayerPoint([0, 0]);
    const se = map.containerPointToLayerPoint(map.getSize());
    const clipX = nw.x + position;

    const clipLeft = `rect(${nw.y}px, ${clipX}px, ${se.y}px, ${nw.x}px)`;
    const clipRight = `rect(${nw.y}px, ${se.x}px, ${se.y}px, ${clipX}px)`;

    // Set clipping for left and right layers based on the swipe position
    map.getPane("leftPane").style.clip = clipLeft;
    map.getPane("rightPane").style.clip = clipRight;
  };

  useEffect(() => {
    updateClip();
  }, [position, leftLayer, rightLayer, map]);

  useEffect(() => {
    map.on("move", updateClip);
    return () => {
      map.off("move", updateClip);
    };
  }, [map, leftLayer, rightLayer]);

  const handleDrag = (e) => {
    const rect = swipeRef.current.parentElement.getBoundingClientRect();
    const newLeft = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setPosition(newLeft);
  };

  const cancelMapDrag = () => {
    mapWasDragEnabled = map.dragging.enabled();
    mapWasTapEnabled = map.tap && map.tap.enabled();
    map.dragging.disable();
    if (map.tap) map.tap.disable();
  };

  const restoreMapDrag = () => {
    if (mapWasDragEnabled) map.dragging.enable();
    if (mapWasTapEnabled) map.tap.enable();
  };

  return (
    <div
      ref={swipeRef}
      className="absolute top-0 bottom-0 w-1 bg-gray-800 opacity-70 cursor-pointer z-[1000] select-none"
      style={{ left: `${position}px` }}
      onMouseDown={(e) => {
        e.stopPropagation(); // Evita que el mapa se mueva mientras se arrastra la barra
        e.preventDefault(); // Evita la selección de texto al arrastrar
        cancelMapDrag();

        const onMouseMove = (moveEvent) => {
          moveEvent.preventDefault();
          handleDrag(moveEvent);
        };
        const onMouseUp = () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          restoreMapDrag();
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }}
    ></div>
  );
};

export default SwipeBar;

/* Explicación:
1. Componente `SwipeBar`: 
   - Se implementa sin `react-draggable` usando eventos `onMouseDown`, `onMouseMove` y `onMouseUp` para manejar el movimiento horizontal.
   - La posición de la barra se almacena en el estado local (`position`) usando `useState`.
   - `cancelMapDrag` desactiva el arrastre y el tapping del mapa mientras se arrastra la barra para garantizar una experiencia fluida.
   - `restoreMapDrag` restaura la funcionalidad de arrastre y tapping del mapa cuando se termina de mover la barra.
   - Se utiliza `useRef` para obtener el tamaño del contenedor y calcular la posición correcta sin saltos bruscos.
   - `useEffect` se utiliza para actualizar el clip de las capas izquierda y derecha según la posición de la barra, asegurando que solo se muestre la parte correspondiente.
   - Se añadió un evento `move` del mapa para recalcular los recortes (`updateClip`) cada vez que se mueve el mapa, garantizando que el clip sea preciso durante cualquier interacción con el mapa.
   - `e.preventDefault()` evita la selección de texto al arrastrar la barra.
   - `select-none` se añade para asegurarse de que no se seleccionen elementos de la página al mover la barra.
2. Este componente debe ser importado y utilizado dentro del `PolygonManager` que está dentro del mapa de Leaflet.
3. El `div` de la barra tiene la clase `z-[1000]` para garantizar que la barra esté por encima del mapa.
*/
