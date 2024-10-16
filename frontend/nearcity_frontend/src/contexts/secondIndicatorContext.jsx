// src/CurrentIndicatorContext.js
import React, { createContext, useEffect, useState } from 'react';

const SecondIndicatorContext = createContext();

export const SecondIndicatorProvider = ({ children }) => {
    const [secondIndicator, setSecondIndicator] = useState(null);

    useEffect(() => {
        console.log("Indicador cambiado a: ", secondIndicator);
    }, [secondIndicator]);

    return (
        <SecondIndicatorContext.Provider value={{ secondIndicator: secondIndicator, setSecondIndicator: setSecondIndicator }}>
            {children}
        </SecondIndicatorContext.Provider>
    );
};

export default SecondIndicatorContext;
