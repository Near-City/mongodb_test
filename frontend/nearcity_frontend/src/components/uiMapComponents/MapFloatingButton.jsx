const MapFloatingButton = ({ onClick, icon }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="h-14 w-auto p-2 bg-secondary rounded-full shadow-md hover:bg-primary hover:text-white cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
      >
        {typeof icon === 'string' ? (
          // Si 'icon' es una cadena, la tratamos como una ruta de imagen (PNG, JPG, etc.)
          <img src={icon} alt="Icon" className="h-8 w-8" />
        ) : (
          // Si 'icon' es un componente, lo tratamos como SVG
          icon ? (
            <icon className="h-8 w-8" />
          ) : (
            // SVG predeterminado si no se pasa ningún icono
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )
        )}
      </button>
    );
  };
  
  export default MapFloatingButton;
  