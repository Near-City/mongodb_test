import React, { useState, useCallback } from "react";
import { get_search } from "@api/geo";
import DebouncedSearchBar from "@components/uiMapComponents/SearchBars/DebouncedSearchBar";

function Preselection() {
  const [activeTab, setActiveTab] = useState("distrito");
  const [results, setResults] = useState([
    "Resultado 1",
    "Resultado 2",
    "Resultado 3",
  ]);

  const handleSearch = useCallback((searchTerm) => {
      console.log("Search term: ", searchTerm);
      get_search(searchTerm).then((data) => {
        console.log("Search results: ", data);
        setResults(data);
      });
    }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setResults(["Resultado 1", "Resultado 2", "Resultado 3"]);
  };


  const handleResultClick = (result) => {
    alert(`Has clicado en: ${result}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Contenedor para las pestañas y el buscador en una misma fila */}
      <div className="flex items-center justify-between mb-4 w-full max-w-md">
        {/* Pestañas (Distrito, Barrio, Calle) */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabClick("distrito")}
            className={`px-4 py-2 rounded ${
              activeTab === "distrito"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            Distrito
          </button>
          <button
            onClick={() => handleTabClick("barrio")}
            className={`px-4 py-2 rounded ${
              activeTab === "barrio"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            Barrio
          </button>
          <button
            onClick={() => handleTabClick("calle")}
            className={`px-4 py-2 rounded ${
              activeTab === "calle"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            Calle
          </button>
        </div>

        <DebouncedSearchBar
          onSearch={handleSearch}
          results={results}
          onResultClick={handleResultClick}
          positionClass={`relative left-12 w-full max-w-lg z-[999]`}
        />
      </div>
    </div>
  );
}

export default Preselection;
