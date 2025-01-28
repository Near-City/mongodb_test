import React, { useState, useRef } from "react";
import {
  CircleMenu,
  CircleMenuItem,
  TooltipPlacement,
  CircleMenuToggle,
} from "react-circular-menu";

import '@styles/menus/CircleMenu.css';
import { TruckIcon } from "@heroicons/react/24/outline";

const ReusableCircleMenu = ({
  menus,
  startAngle = 180,
  rotationAngle = 360,
  itemSize = 3,
  radius = 7,
  menuToggleElement = null,
}) => {
  const [currentMenu, setCurrentMenu] = useState(Object.keys(menus)[0]); // Default to the first menu key
  const buttonRef = useRef(null);
  return (
    <div>
      <CircleMenu
        startAngle={startAngle}
        rotationAngle={rotationAngle}
        itemSize={itemSize}
        radius={radius}
        menuToggleElement={menuToggleElement}
        rotationAngleInclusive={false}
        className="z-[999]"
      >
        {menus[currentMenu].map((item, index) => (
          <CircleMenuItem
            key={index}
            onClick={() => {
              item.action && item.action(setCurrentMenu); // Pass setCurrentMenu to actions
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
