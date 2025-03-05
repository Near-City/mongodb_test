import {
  Squares2X2Icon,
  HeartIcon,
  AcademicCapIcon,
  SparklesIcon,
  TruckIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  BuildingLibraryIcon,
  ClockIcon,
  UserIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// Menú 1: Recursos
export const resourcesMenuData = [
  {
    label: "Recursos",
    icon: Squares2X2Icon, // Pasamos el componente directamente
    subItems: [
      {
        label: "Salud",
        icon: HeartIcon,
        subItems: [
          { label: "Hospitales", icon: BuildingOffice2Icon, onClick: () => alert("Hospitales") },
          { label: "Ambulatorios", icon: BuildingStorefrontIcon, onClick: () => alert("Ambulatorios") },
          { label: "Clínicas", icon: BuildingLibraryIcon, onClick: () => alert("Clínicas") },
        ],
      },
      {
        label: "Educación",
        icon: AcademicCapIcon,
        subItems: [
          { label: "Universidades", icon: BuildingOffice2Icon, onClick: () => alert("Universidades") },
          { label: "Colegios", icon: BuildingStorefrontIcon, onClick: () => alert("Colegios") },
          { label: "Academias", icon: BuildingLibraryIcon, onClick: () => alert("Academias") },
        ],
      },
      {
        label: "Ocio",
        icon: SparklesIcon,
        subItems: [
          { label: "Cines", icon: BuildingOffice2Icon, onClick: () => alert("Cines") },
          { label: "Teatros", icon: BuildingStorefrontIcon, onClick: () => alert("Teatros") },
          { label: "Parques", icon: BuildingLibraryIcon, onClick: () => alert("Parques") },
        ],
      },
    ],
  },
];

// Menú 2: Tiempos
export const timeMenuData = [
  { label: "5 min", icon: ClockIcon, onClick: () => alert("5 min") },
  { label: "10 min", icon: ClockIcon, onClick: () => alert("10 min") },
  { label: "15 min", icon: ClockIcon, onClick: () => alert("15 min") },
  { label: "20 min", icon: ClockIcon, onClick: () => alert("20 min") },
];

// Menú 3: Redes
export const networkMenuData = [
  { label: "Caminando", icon: UserIcon, onClick: () => alert("Caminando") },
  { label: "Bicicleta", icon: UserGroupIcon, onClick: () => alert("Bicicleta") },
  { label: "Metro", icon: GlobeAltIcon, onClick: () => alert("Transporte Público") },
];
