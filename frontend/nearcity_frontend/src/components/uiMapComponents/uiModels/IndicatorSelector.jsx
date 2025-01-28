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

import ConfigContext from "@contexts/configContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { useContext, useEffect } from "react";
import { updateIndicatorInCurrentInfo } from "@mixins/currentInfoUtils";

export const LocIconButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-2 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black h-24 w-24 flex items-center justify-center"
    >
      <FaBuilding className="h-12 w-12" />
    </button>
  );
};

export const RedIconButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-2 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black h-24 w-24 flex items-center justify-center"
    >
      <FaWalking className="h-12 w-12" />
    </button>
  );
};

export const TimeIconButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-2 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black h-24 w-24 flex items-center justify-center"
    >
      <IoTime className="h-12 w-12" />
    </button>
  );
};

const IndicatorSelector = () => {
  const config = useContext(ConfigContext);

  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);

  useEffect(() => {
    if (currentInfo?.indicators?.primary) return;
    
    // Set default values
    setCurrentInfo((prevState) => {
      const indicators = prevState.indicators || {};
      const indicator = indicators.primary || {};
      return {
        ...prevState,
        indicators: {
          ...indicators,
          ["primary"]: {
            ...indicator,
            ["resource"]: "loc7",
            ["extra"]: "total",
            ["time"]: 5,
            ["user"]: "normatividad",
            ["red"]: "caminable",
          },
        },
      };
    });
  }, [currentInfo?.indicators?.primary]);

  const locs = {
    categorias: [
      {
        tooltip: "Salud",
        icon: <HeartIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("saludSubmenu"), // Switch to submenu
      },
      {
        tooltip: "Educación",
        icon: <AcademicCapIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("educacionSubmenu"), // Switch to submenu
      },
      {
        tooltip: "Ocio",
        icon: <MusicalNoteIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("ocioSubmenu"), // Switch to submenu
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
        action: (setMenu) => setMenu("categorias"), // Go back to main menu
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
        action: (setMenu) => setMenu("categorias"), // Go back to main menu
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
        action: (setMenu) => setMenu("categorias"), // Go back to main menu
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
        label: "5",
        action: () => handleTimeChange(5),
      },
      {
        tooltip: "10 min",
        label: "10",
        action: () => handleTimeChange(10),
      },
      {
        tooltip: "15 min",
        label: "15",
        action: () => handleTimeChange(15),
      },
      {
        tooltip: "20 min",
        label: "20",
        action: () => handleTimeChange(20),
      },
      {
        tooltip: "30 min",
        label: "30",
        action: () => handleTimeChange(30),
      },
    ],
  };

  const handleLocChange = (loc) => {
    console.log("Loc: ", loc);
    updateIndicatorInCurrentInfo(setCurrentInfo, "primary", "resource", loc);
  };

  const handleRedChange = () => {
    setMenu("redes");
  };

  const handleTimeChange = (time) => {
    console.log("Time: ", time);
    updateIndicatorInCurrentInfo(setCurrentInfo, "primary", "time", time);
  };

  return (
    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 gap-52 flex flex-row z-[999] ">
      <ReusableCircleMenu menus={locs} menuToggleElement={<LocIconButton />} />
      <ReusableCircleMenu menus={redes} menuToggleElement={<RedIconButton />} />
      <ReusableCircleMenu
        menus={tiempos}
        menuToggleElement={<TimeIconButton />}
      />
    </div>
  );
};

export default IndicatorSelector;
