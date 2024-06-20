import SelectComponent from "@components/uiMapComponents/Selects/SelectComponente";
import React from 'react';
import { useEffect, useState } from "react";
import ExecuteBtn from "@components/Buttons/ExecuteBtn";
const ResourceSelector = ({}) => {
    const [selectedResource, setSelectedResource] = useState("Colegios");



    const handleResourceChange = (value) => {
        setSelectedResource(value);
    }

    const resources = [
        { value: "Colegios", label: "Colegios" },
        { value: "Hospitales", label: "Hospitales" },
        { value: "Farmacias", label: "Farmacias" },
        { value: "Supermercados", label: "Supermercados" },
        { value: "Bancos", label: "Bancos" },
        { value: "Paradas de bus", label: "Paradas de bus" },
        { value: "Paradas de metro", label: "Paradas de metro" },
        { value: "Parques", label: "Parques" },
    ]

    const extraOptions = {
        "Colegios": [{ value: "Públicos", label: "Públicos"}, { value: "Privados", label: "Privados"}, { value: "Concertados", label: "Concertados"}],
    }

    return (
        <div className="w-80 flex flex-col gap-5">
            <div className="flex gap-5">
                <SelectComponent items={resources} onChange={handleResourceChange} selectedValue={selectedResource} />
                { selectedResource && extraOptions[selectedResource] && <SelectComponent items={extraOptions[selectedResource]} onChange={(value) => console.log(value)} selectedValue="Públicos" /> }
            </div>
            <ExecuteBtn />
        </div>

    );
}

export default ResourceSelector;