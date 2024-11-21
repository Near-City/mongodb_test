import React, { useState } from "react";

function SearchBar({ onSearch, results, onResultClick }) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Estado para manejar el valor del input

  const handleInputChange = (value) => {
    console.log("Input value:", value);
    setInputValue(value);
    onSearch(value); // Llama al método onSearch con el nuevo valor
  };

  return (
    <div className="absolute top-4 right-4 w-full max-w-lg z-[999]">
      {/* Input de búsqueda */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white shadow-md rounded-lg border ${
          isFocused ? "border-blue-400" : "border-gray-300"
        }`}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar barrios, calles o parcelas..."
            className="w-full p-3 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none"
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {/* Icono de lupa */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l5 5m-5-5a7 7 0 1114-14 7 7 0 01-14 14z"
            />
          </svg>
        </div>
      </div>

      {/* Resultados */}
      {inputValue.trim() !== "" && results && results.length > 0 && (
        <div className="absolute w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-3 hover:bg-blue-100 cursor-pointer text-gray-700"
              onClick={() => onResultClick(result)}
            >
              {result.properties.N_BAR} {/* Muestra el nombre del barrio */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
