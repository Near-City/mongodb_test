import React, { useState } from "react";

function SearchBar({ onSearch, results }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Input de búsqueda */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white shadow-md rounded-lg overflow-hidden border ${
          isFocused ? "border-blue-400" : "border-gray-300"
        }`}
      >
        <input
          type="text"
          placeholder="Buscar barrios, calles o parcelas..."
          className="w-full p-3 text-gray-700 placeholder-gray-400 focus:outline-none"
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {/* Icono de lupa */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
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

      {/* Resultados */}
      {results && results.length > 0 && (
        <div className="absolute w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-3 hover:bg-blue-100 cursor-pointer text-gray-700"
              onClick={() => onSearch(result)}
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
