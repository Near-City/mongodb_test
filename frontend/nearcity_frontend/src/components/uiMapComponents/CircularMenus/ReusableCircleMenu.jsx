import React, { useState, useRef, cloneElement } from "react";
import {
  CircleMenu,
  CircleMenuItem,
  TooltipPlacement,
  CircleMenuToggle,
} from "react-circular-menu";

import '@styles/menus/CircleMenu.css';

const ReusableCircleMenu = ({
  menus,
  startAngle = 180,
  rotationAngle = 360,
  itemSize = 3,
  radius = 7,
  menuToggleElement = null,
  selectedToggleContent = null,
  setSelectedToggleContent = null,
}) => {
  // Seleccionamos el primer menú por defecto
  const [currentMenu, setCurrentMenu] = useState(Object.keys(menus)[0]);
  // Estado para almacenar el contenido que se mostrará en el toggle
  const buttonRef = useRef(null);

  // Si hay un contenido seleccionado, clonamos el toggle element y reemplazamos sus children.
  const toggleElement = selectedToggleContent
    ? cloneElement(menuToggleElement, {}, selectedToggleContent)
    : menuToggleElement;

  return (
    <div>
      <CircleMenu
        startAngle={startAngle}
        rotationAngle={rotationAngle}
        itemSize={itemSize}
        radius={radius}
        menuToggleElement={toggleElement}
        rotationAngleInclusive={false}
        className="z-[999]"
      >
        {menus[currentMenu].map((item, index) => (
          <CircleMenuItem
            key={index}
            onClick={() => {
              // Actualizamos el contenido del toggle según el ítem seleccionado.
              if (setSelectedToggleContent) {
                setSelectedToggleContent(item.label || item.icon);
              }
              // Ejecutamos la acción del ítem (pasándole setCurrentMenu en caso de que se cambie de submenu)
              if (item.action) {
                item.action(setCurrentMenu);
              }
            }}
            tooltip={item.tooltip}
            tooltipPlacement={TooltipPlacement.Right}
          >
            {item.label || item.icon}
          </CircleMenuItem>
        ))}
      </CircleMenu>
    </div>
  );
};

export default ReusableCircleMenu;
