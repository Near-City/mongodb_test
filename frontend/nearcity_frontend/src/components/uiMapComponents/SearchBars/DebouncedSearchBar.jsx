import React, { useState, useEffect } from "react";
import SearchBar from "@components/SearchBar";
function DebouncedSearchBar({ onSearch, results, onResultClick, positionClass, keepSelection = false }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Timer de debounce
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        onSearch(searchTerm); // Ejecuta la query al servidor
      }
    }, 500); // Espera 500ms

    return () => clearTimeout(timer); // Limpia el timer si el usuario sigue escribiendo
  }, [searchTerm, onSearch]);

  return (
    <SearchBar onSearch={setSearchTerm} results={results} onResultClick={onResultClick} positionClass={positionClass} keepSelection={keepSelection}/>
  );
}

export default DebouncedSearchBar;
