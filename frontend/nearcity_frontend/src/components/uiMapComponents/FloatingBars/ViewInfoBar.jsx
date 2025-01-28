import { useState, useEffect, useContext } from "react";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { TiDelete } from "react-icons/ti";

const ViewInfoBar = () => {

  const { currentInfo } = useContext(CurrentInfoContext);

  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true); // Activa la animación de salida
    setTimeout(() => {
      setIsVisible(false); // Elimina la barra tras la animación
      if (currentInfo.viewInfo?.onClose) {
        currentInfo.viewInfo.onClose(); // Llama a la función para manejar el cierre
      }
    }, 300); // El tiempo debe coincidir con la duración de la animación
  };

  useEffect(() => {
    if (currentInfo.viewInfo) {

      setIsExiting(false); // Reinicia el estado de salida cuando la barra aparece
      setIsVisible(true); // Muestra la barra si hay información
    } else if (isVisible){
      handleClose(); // Cierra la barra si no hay información
    }
  }, [currentInfo.viewInfo]);

  return (
    isVisible && currentInfo.viewInfo?.text && (
      <div
        className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[999] transition-all duration-300  ${
          isExiting ? "-translate-y-16 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="bg-white shadow-xl rounded-l-2xl border border-gray-300 text-center flex items-center  justify-between px-4 pl-24 py-2 max-w-2xl h-16">
          <span className="text-gray-700 text-md font-medium text-center">
            {currentInfo.viewInfo.text}
          </span>
          <button
            className="text-gray-500 hover:text-gray-700 ml-16"
            onClick={handleClose}
          >
            <TiDelete 
            size={30}
            />
          </button>
        </div>
      </div>
    )
  );
};

export default ViewInfoBar;
