import React, { useState, useCallback, useContext } from "react";
import { get_search } from "@api/geo";
import DebouncedSearchBar from "@components/uiMapComponents/SearchBars/DebouncedSearchBar";
import ReusableCircleMenu from "@components/uiMapComponents/CircularMenus/ReusableCircleMenu";
import { setIndicatorInCurrentInfo } from "@mixins/currentInfoUtils";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { useNavigate } from "react-router-dom";

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
  BoltIcon,
} from "@heroicons/react/24/outline";
import { FaBuilding, FaWalking } from "react-icons/fa";
import { IoTime } from "react-icons/io5";

const LocIconButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full shadow-lg transform transition-transform duration-200 
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
      ${children ? "border-4 border-blue-500" : "border-none"} 
      bg-white flex items-center justify-center`}
    >
      {children ? children : <FaBuilding className="h-16 w-16" />}
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
      bg-white flex items-center justify-center`}
    >
      {children ? children : <FaWalking className="h-16 w-16" />}
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
      {children ? children : <IoTime className="h-16 w-16" />}
    </button>
  );
};

const LocSelector = ({ onLocSelected }) => {
  const [selectedLoc, setSelectedLoc] = useState(null);
  const smallIconClassName = "h-6 w-6";
  const bigIconClassName = "h-16 w-16";
  const locs = {
    categorias: [
      {
        tooltip: "Salud",
        icon: <HeartIcon className={smallIconClassName} />,
        action: (setMenu) => setMenu("saludSubmenu"), // Cambia a submenu
      },
      {
        tooltip: "Educación",
        icon: <AcademicCapIcon className={smallIconClassName} />,
        action: (setMenu) => setMenu("educacionSubmenu"),
      },
      {
        tooltip: "Ocio",
        icon: <MusicalNoteIcon className={smallIconClassName} />,
        action: (setMenu) => setMenu("ocioSubmenu"),
      },
      {
        tooltip: "Otro",
        icon: <EllipsisHorizontalCircleIcon className={smallIconClassName} />,
        action: () => alert("Otro"),
      },
    ],

    saludSubmenu: [
      {
        tooltip: "Back to Main Menu",
        icon: <ArrowLeftIcon className={smallIconClassName} />,
        action: (setMenu) => setMenu("categorias"),
      },
      {
        tooltip: "Hospitales",
        icon: <BuildingOffice2Icon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc7",
            <BuildingOffice2Icon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros de salud",
        icon: <BuildingOffice2Icon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc8",
            <BuildingOffice2Icon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros de especialidades",
        icon: <BuildingOffice2Icon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc9",
            <BuildingOffice2Icon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros de día y CEAs",
        icon: <BuildingOffice2Icon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc10",
            <BuildingOffice2Icon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Residencias",
        icon: <BuildingOffice2Icon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc11",
            <BuildingOffice2Icon className={bigIconClassName} />
          ),
      },
    ],
    educacionSubmenu: [
      {
        tooltip: "Back to Main Menu",
        icon: <ArrowLeftIcon className={smallIconClassName} />,
        action: (setMenu) => setMenu("categorias"),
      },
      {
        tooltip: "Centros Infantil",
        icon: <AcademicCapIcon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc1",
            <AcademicCapIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros Primaria",
        icon: <BuildingLibraryIcon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc2",
            <BuildingLibraryIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros secundaria",
        icon: <BuildingLibraryIcon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc3",
            <BuildingLibraryIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros Bachillerato",
        icon: <BuildingLibraryIcon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc4",
            <BuildingLibraryIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros FP",
        icon: <BuildingLibraryIcon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc5",
            <BuildingLibraryIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Centros Educación Personas Adultas",
        icon: <BuildingLibraryIcon className={smallIconClassName} />,
        action: () =>
          handleLocChange(
            "loc6",
            <BuildingLibraryIcon className={bigIconClassName} />
          ),
      },
    ],
    ocioSubmenu: [
      {
        tooltip: "Back to Main Menu",
        icon: <ArrowLeftIcon className={smallIconClassName} />,
        action: (setMenu) => setMenu("categorias"),
      },
      {
        tooltip: "Cine",
        icon: <MusicalNoteIcon className={smallIconClassName} />,
        action: () => alert("Submenu Item 1"),
      },
      {
        tooltip: "Teatro",
        icon: <MusicalNoteIcon className={smallIconClassName} />,
        action: () => alert("Submenu Item 2"),
      },
      {
        tooltip: "Parques",
        icon: <BuildingLibraryIcon className={smallIconClassName} />,
        action: () => alert("Submenu Item 3"),
      },
    ],
  };

  const handleLocChange = (loc, element) => {
    setSelectedLoc(element);
    onLocSelected(loc);
  };

  return (
    <ReusableCircleMenu
      menus={locs}
      radius={7}
      itemSize={3}
      startAngle={180}
      rotationAngle={360}
      menuToggleElement={<LocIconButton />}
      selectedToggleContent={selectedLoc}
    />
  );
};

const TransportSelector = ({ onTransportSelected }) => {
  const [selectedTransport, setSelectedTransport] = useState(null);
  const smallIconClassName = "h-6 w-6";
  const bigIconClassName = "h-16 w-16";
  const redes = {
    redes: [
      {
        tooltip: "Caminable",
        icon: <UserIcon className={smallIconClassName} />,
        action: () =>
          handleTransportChange(
            "caminable",
            <UserIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Metro",
        icon: <TruckIcon className={smallIconClassName} />,
        action: () =>
          handleTransportChange(
            "metro",
            <TruckIcon className={bigIconClassName} />
          ),
      },
      {
        tooltip: "Bici",
        icon: <BoltIcon className={smallIconClassName} />,
        action: () =>
          handleTransportChange(
            "bici",
            <BoltIcon className={bigIconClassName} />
          ),
      },
    ],
  };

  const handleTransportChange = (transport, element) => {
    setSelectedTransport(element);
    if (onTransportSelected) onTransportSelected(transport);
  };

  return (
    <ReusableCircleMenu
      menus={redes}
      radius={7}
      itemSize={3}
      startAngle={180}
      rotationAngle={360}
      menuToggleElement={<RedIconButton />}
      selectedToggleContent={selectedTransport}
    />
  );
};


const TimeSelector = ({ onTimeSelected }) => {
  const [selectedTime, setSelectedTime] = useState(null);

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

  const handleTimeChange = (time, element) => {
    setSelectedTime(element);
    if (onTimeSelected) onTimeSelected(time);
  };

  return (
    <ReusableCircleMenu
      menus={tiempos}
      radius={7}
      itemSize={3}
      startAngle={180}
      rotationAngle={360}
      menuToggleElement={<TimeIconButton />}
      selectedToggleContent={selectedTime}
    />
  );
};


function Preselection() {
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("distrito");
  const [results, setResults] = useState([
    "Resultado 1",
    "Resultado 2",
    "Resultado 3",
  ]);

  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);

  const handleSearch = useCallback(
    (searchTerm) => {
      console.log("Search term: ", searchTerm);
      let only_distritos = activeTab === "distrito";
      let only_barrios = activeTab === "barrio";
      let only_calles = activeTab === "calle";

      get_search(searchTerm, only_barrios, only_distritos, only_calles).then(
        (data) => {
          console.log("Search results: ", data);
          setResults(data);
        }
      );
    },
    [activeTab]
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedOrigin(null);
    setSelectedLoc(null);
    setSelectedTransport(null);
    setSelectedTime(null);
    
    setResults(["Resultado 1", "Resultado 2", "Resultado 3"]);
  };

  const handleResultClick = (result) => {
    setSelectedOrigin(result);
  };

  const handleContinue = () => {
    console.log("Continue with selections:", {
      origin: selectedOrigin,
      location: selectedLoc,
      transport: selectedTransport,
      time: selectedTime,
    });

    setCurrentInfo((prevInfo) => {
      return {
        ...prevInfo,
        userInfo: {
          userOrigin: selectedOrigin,
          userLocation: selectedLoc,
          userTransport: selectedTransport,
          userTime: selectedTime,
        }
      };
      
    });

    // Mover a la ruta /dashboard
    navigate("/dashboard");



  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl  transition-all duration-500 ease-in-out">
        {/* Header section with tabs and search */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Tab navigation */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {["distrito", "barrio", "calle"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="w-full md:w-auto md:min-w-[300px]">
              <DebouncedSearchBar
                onSearch={handleSearch}
                results={results}
                onResultClick={handleResultClick}
                positionClass="relative w-full z-[999]"
                
              />
            </div>
          </div>
        </div>

        {/* Selection section */}
        <div className="p-6">
          {selectedOrigin ? (
            <div className="flex flex-col items-center">
              <div className="text-center mb-6">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                  Origen seleccionado: {typeof selectedOrigin === 'object' ? selectedOrigin.name || JSON.stringify(selectedOrigin) : String(selectedOrigin)}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-center mb-3 text-gray-600">
                    <p>Seleccione ubicación</p>
                  </div>
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <LocSelector onLocSelected={(loc) => setSelectedLoc(loc)} />
                  </div>
                </div>

                {selectedLoc && (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="text-center mb-3 text-gray-600">
                      <p>Seleccione transporte</p>
                    </div>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <TransportSelector
                        onTransportSelected={(transport) =>
                          setSelectedTransport(transport)
                        }
                      />
                    </div>
                  </div>
                )}

                {selectedTransport && (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="text-center mb-3 text-gray-600">
                      <p>Seleccione tiempo</p>
                    </div>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <TimeSelector
                        onTimeSelected={(time) => setSelectedTime(time)}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Continue button - appears only when all selections are made */}
              {selectedLoc && selectedTransport && selectedTime && (
                <div className="mt-8 animate-fade-in">
                  <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md
                    transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
                  >
                    <span>Continuar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>Por favor, seleccione un origen para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Preselection;
