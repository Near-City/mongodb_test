// src/CurrentIndicatorContext.js
import React, { createContext, useEffect, useState } from 'react';

const CurrentInfoContext = createContext();

export const CurrentInfoProvider = ({ children }) => {
    const [currentInfo, setCurrentInfo] = useState({});

    useEffect(() => {
        console.log("CurrentInfo: ", currentInfo);
    }, [currentInfo]);

    return (
        <CurrentInfoContext.Provider value={{ currentInfo: currentInfo, setCurrentInfo: setCurrentInfo }}>
            {children}
        </CurrentInfoContext.Provider>
    );
};

export default CurrentInfoContext;
