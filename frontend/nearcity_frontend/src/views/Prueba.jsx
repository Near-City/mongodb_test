import React, { useState } from "react";
import ReusableCircleMenu from "@components/uiMapComponents/CircularMenus/ReusableCircleMenu";

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


const Prueba = () => {

  const locs = {
    categorias: [
      {
        tooltip: "Salud",
        icon:  <HeartIcon className="h-6 w-6" />,
        action: (setMenu) => setMenu("saludSubmenu"), // Switch to submenu
      },
      {
        tooltip: "Educación",
        icon: <AcademicCapIcon  className="h-6 w-6" />,
        action: (setMenu) => setMenu("educacionSubmenu"), // Switch to submenu
      },
      {
        tooltip: "Ocio",
        icon: <MusicalNoteIcon  className="h-6 w-6" />,
        action: (setMenu) => setMenu("ocioSubmenu"), // Switch to submenu
      },
      {
        tooltip: "Otro",
        icon: <EllipsisHorizontalCircleIcon  className="h-6 w-6" />,
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
            action: () => alert("Submenu Item 1"),
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
      }
    ]
  }

  const tiempos = {
    tiempos: [
      {
        tooltip: "5 min",
        label: "5",
        action: () => alert("10 min"),
      },
      {
        tooltip: "10 min",
        label: "10",
        action: () => alert("10 min"),
      },
      {
        tooltip: "15 min",
        label: "15",
        action: () => alert("20 min"),
      },
      {
        tooltip: "20 min",
        label: "20",
        action: () => alert("20 min"),
      },
      {
        tooltip: "30 min",
        label: "30",
        action: () => alert("20 min"),
      },
    ]
  }

  return (
    <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            position: "relative",
            gap: "60px",
          }}>
        <ReusableCircleMenu menus={locs} />
        <ReusableCircleMenu menus={redes} />
        <ReusableCircleMenu menus={tiempos} />

    </div>
  );
};

export default Prueba;
