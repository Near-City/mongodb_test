import ReusableCircleMenu from "../CircularMenus/ReusableCircleMenu";
import {
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  MapPinIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  FolderIcon,
  HeartIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  MusicalNoteIcon,
  EllipsisHorizontalCircleIcon,
  UserIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

import { FaBuilding, FaWalking } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { useState, useContext, useEffect } from "react";

import ConfigContext from "@contexts/configContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { updateIndicatorInCurrentInfo } from "@mixins/currentInfoUtils";

export const LocIconButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full shadow-lg transform transition-transform duration-200 
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
      ${children ? "border-4 border-blue-500" : "border-none"} 
      bg-white h-24 w-24 flex items-center justify-center`}
    >
      {children ? children : <FaBuilding className="h-12 w-12" />}
    </button>
  );
};

export const RedIconButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full shadow-lg transform transition-transform duration-200 
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
      ${children ? "border-4 border-blue-500" : "border-none"} 
      bg-white h-24 w-24 flex items-center justify-center`}
    >
      {children ? children : <FaWalking className="h-12 w-12" />}
    </button>
  );
};


export const TimeIconButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full shadow-lg transform transition-transform duration-200 
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
      ${children ? "border-4 border-blue-500" : "border-none"} 
      bg-white h-24 w-24 flex items-center justify-center`}
    >
      {children ? children : <IoTime className="h-12 w-12" />}
    </button>
  );
};

const IndicatorSelector = () => {
  const config = useContext(ConfigContext);
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);

  useEffect(() => {
    if (currentInfo?.indicators?.[indicatorName]) return;

    // Setear valores por defecto
    setCurrentInfo((prevState) => {
      const indicators = prevState.indicators || {};
      const indicator = indicators[indicatorName] || {};
      return {
        ...prevState,
        indicators: {
          ...indicators,
          [indicatorName]: {
            ...indicator,
            resource: "loc7",
            extra: "total",
            time: 5,
            user: "normatividad",
            red: "caminable",
          },
        },
      };
    });
  }, [currentInfo?.indicators?.[indicatorName]]);

  // Definir los menús de opciones
  const locs = {
    categorias: [
      {
        tooltip: "Salud",
        icon: <HeartIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("saludSubmenu"), // Cambia a submenu
      },
      {
        tooltip: "Educación",
        icon: <AcademicCapIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("educacionSubmenu"),
      },
      {
        tooltip: "Ocio",
        icon: <MusicalNoteIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("ocioSubmenu"),
      },
      {
        tooltip: "Otro",
        icon: <EllipsisHorizontalCircleIcon className="h-6 w-6" />,
        action: () => alert("Otro"),
      },
    ],

    saludSubmenu: [
      {
        tooltip: "Back to Main Menu",
        icon: <ArrowLeftIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("categorias"),
      },
      {
        tooltip: "Hospitales",
        icon: <BuildingOffice2Icon className="h-6 w-6" />,
        action: () => handleLocChange("loc7"),
      },
      {
        tooltip: "Ambulatorios",
        icon: <BuildingOffice2Icon className="h-6 w-6" />,
        action: () => alert("Submenu Item 2"),
      },
      {
        tooltip: "Clínicas",
        icon: <BuildingOffice2Icon className="h-6 w-6" />,
        action: () => alert("Submenu Item 3"),
      },
    ],
    educacionSubmenu: [
      {
        tooltip: "Back to Main Menu",
        icon: <ArrowLeftIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("categorias"),
      },
      {
        tooltip: "Universidades",
        icon: <AcademicCapIcon className="h-6 w-6" />,
        action: () => alert("Submenu Item 1"),
      },
      {
        tooltip: "Colegios",
        icon: <BuildingLibraryIcon className="h-6 w-6" />,
        action: () => alert("Submenu Item 2"),
      },
      {
        tooltip: "Academias",
        icon: <BuildingLibraryIcon className="h-6 w-6" />,
        action: () => alert("Submenu Item 3"),
      },
    ],
    ocioSubmenu: [
      {
        tooltip: "Back to Main Menu",
        icon: <ArrowLeftIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("categorias"),
      },
      {
        tooltip: "Cine",
        icon: <MusicalNoteIcon className="h-6 w-6" />,
        action: () => alert("Submenu Item 1"),
      },
      {
        tooltip: "Teatro",
        icon: <MusicalNoteIcon className="h-6 w-6" />,
        action: () => alert("Submenu Item 2"),
      },
      {
        tooltip: "Parques",
        icon: <BuildingLibraryIcon className="h-6 w-6" />,
        action: () => alert("Submenu Item 3"),
      },
    ],
  };

  const redes = {
    redes: [
      {
        tooltip: "Caminable",
        icon: <UserIcon className="h-6 w-6" />,
        action: () => alert("Caminable"),
      },
      {
        tooltip: "Metro",
        icon: <TruckIcon className="h-6 w-6" />,
        action: () => alert("Metro"),
      },
    ],
  };

  const tiempos = {
    tiempos: [
      {
        tooltip: "5 min",
        label: "5 min",
        action: () => handleTimeChange(5, "5 min"),
      },
      {
        tooltip: "10 min",
        label: "10 min",
        action: () => handleTimeChange(10, "10 min"),
      },
      {
        tooltip: "15 min",
        label: "15 min",
        action: () => handleTimeChange(15, "15 min"),
      },
      {
        tooltip: "20 min",
        label: "20 min",
        action: () => handleTimeChange(20, "20 min"),
      },
      {
        tooltip: "30 min",
        label: "30 min",
        action: () => handleTimeChange(30, "30 min"),
      },
    ],
  };

  // Funciones para actualizar los indicadores
  const handleLocChange = (loc) => {
    console.log("Loc: ", loc);
    updateIndicatorInCurrentInfo(
      setCurrentInfo,
      indicatorName,
      "resource",
      loc
    );
  };

  const handleTimeChange = (time, element) => {
    console.log("Time: ", time);
    if (setSelectedTimeElement) setSelectedTimeElement(element);
    updateIndicatorInCurrentInfo(setCurrentInfo, indicatorName, "time", time);
  };

  // Determinar las clases de posicionamiento según la propiedad "position"
  let positionClasses = "";
  switch (position) {
    case "bottom-center":
      positionClasses =
        "absolute bottom-32 left-1/2 transform -translate-x-1/2";
      break;
    case "left-center":
      positionClasses = "absolute left-8 top-1/2 transform -translate-y-1/2";
      break;
    case "right-center":
      positionClasses = "absolute right-8 top-1/2 transform -translate-y-1/2";
      break;
    case "bottom":
      positionClasses = "absolute bottom-0 left-0 right-0";
      break;
    default:
      positionClasses =
        "absolute bottom-32 left-1/2 transform -translate-x-1/2";
      break;
  }

  // Determinar la dirección del flex según la propiedad "layout"
  const layoutClass = layout === "column" ? "flex-col" : "flex-row";

  return (
    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 gap-52 flex flex-row z-[999] ">
      <ReusableCircleMenu menus={locs} menuToggleElement={<LocIconButton />} />
      <ReusableCircleMenu menus={redes} menuToggleElement={<RedIconButton />} />
      <ReusableCircleMenu
        menus={tiempos}
        menuToggleElement={<TimeIconButton />}
        startAngle={startAngle}
        radius={radius}
        rotationAngle={rotationAngle}
        selectedToggleContent={selectedTimeElement}
        setSelectedToggleContent={setSelectedTimeElement}
      />
    </div>
  );
};

export default IndicatorSelector;
