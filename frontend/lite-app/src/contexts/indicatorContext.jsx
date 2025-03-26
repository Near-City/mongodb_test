// src/CurrentIndicatorContext.js
import React, { createContext, useEffect, useState } from 'react';

const CurrentIndicatorContext = createContext();

export const CurrentIndicatorProvider = ({ children }) => {
    const [currentIndicator, setCurrentIndicator] = useState(null);

    useEffect(() => {
        console.log("Indicador cambiado a: ", currentIndicator);
    }, [currentIndicator]);

    return (
        <CurrentIndicatorContext.Provider value={{ currentIndicator, setCurrentIndicator }}>
            {children}
        </CurrentIndicatorContext.Provider>
    );
};

export default CurrentIndicatorContext;
