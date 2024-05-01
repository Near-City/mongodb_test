import React, { useState, useCallback } from 'react';
import { TextField } from '@mui/material';
import debounce from 'lodash.debounce';

function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');

  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 300), // 300 ms de espera
    []
  );

  const handleChange = (event) => {
    const { value } = event.target;
    setInput(value);
    debouncedSearch(value);
  };

  return (
    <TextField
      label="Buscar"
      variant="outlined"
      value={input}
      onChange={handleChange}
      fullWidth
    />
  );
}

export default SearchBar;
