import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({
  onSearch,
  results,
  onResultClick,
  // Permite personalizar la posición/estilos del contenedor
  // Si no se especifica, se usará el valor por defecto
  positionClass = "relative top-4 left-12 w-full max-w-lg z-[999]",
  // Nueva opción para mantener seleccionado el resultado
  keepSelection = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const containerRef = useRef(null);

  const handleInputChange = (value) => {
    console.log("Input value:", value);
    setInputValue(value);
    setSelectedResult(null); // Limpiar resultado seleccionado al escribir
    onSearch(value);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      if (!keepSelection || !selectedResult) {
        setInputValue(""); // Cierra los resultados al hacer clic fuera si no hay selección o no se mantiene
      }
    }
  };

  const handleResultClick = (result) => {
    if (keepSelection) {
      setInputValue(result.name);
      setSelectedResult(result);
    } else {
      setInputValue("");
    }
    onResultClick(result);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [keepSelection, selectedResult]);

  return (
    <div ref={containerRef} className={positionClass}>
      {/* Input de búsqueda */}
      <div
        className={`flex items-center transition-all duration-300 ease-in-out bg-white shadow-md border ${
          isFocused ? "border-blue-400" : selectedResult ? "border-green-500" : "border-gray-300"
        } rounded-full`}
      >
        <div className="flex items-center pl-4">
          <FaSearch className={selectedResult ? "text-green-500" : "text-gray-500"} />
        </div>
        <input
          type="text"
          placeholder="Buscar barrios, calles o parcelas..."
          className={`flex-1 p-3 pl-4 pr-4 ${
            selectedResult ? "text-green-700 font-medium" : "text-gray-700"
          } placeholder-gray-400 focus:outline-none rounded-full [color-scheme:light]`}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={inputValue}
        />
      </div>

      {inputValue.trim() !== "" && !selectedResult && results && results.length > 0 && (
        <div className="absolute w-full bg-white border border-gray-300 shadow-lg mt-1 max-h-60 overflow-y-auto z-10 rounded-lg">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-3 flex justify-between hover:bg-blue-100 cursor-pointer text-gray-700"
              onClick={() => handleResultClick(result)}
            >
              <span>{result.name}</span>
              <span className="text-gray-500 text-sm">{result.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
