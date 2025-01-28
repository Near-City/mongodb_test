const MapFloatingButton = ({ onClick, icon, id }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="h-14 w-auto p-2 bg-secondary rounded-full shadow-md hover:bg-primary hover:text-white cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
      id={id}
    >
      {typeof icon === "string" ? (
        // Si `icon` es una cadena, renderiza como imagen
        <img src={icon} alt={`${id} Icon`} className="h-8 w-8" />
      ) : (
        // Si `icon` es un elemento JSX, renderízalo directamente
        <span className="h-8 w-8 flex items-center justify-center">{icon}</span>
      )}
    </button>
  );
};

export default MapFloatingButton;
