import React, { createContext, useState, useEffect } from 'react';
const ConfigContext = createContext();

import { getConfig } from "../api/geo.js";

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getConfig().then((data) => {
            console.log(data);
            setConfig(data);
            setLoading(false);
        });
    }, []);
    if (loading){
        return <div>Loading...</div>; // or any other loading component
    }
    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigContext;
