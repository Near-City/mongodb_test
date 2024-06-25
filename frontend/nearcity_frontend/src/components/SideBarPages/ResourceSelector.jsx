import SelectComponent from "@components/uiMapComponents/Selects/SelectComponente";
import React from 'react';
import { useEffect, useState, useContext } from "react";
import ExecuteBtn from "@components/Buttons/ExecuteBtn";
import ConfigContext from "@contexts/configContext";
import { getValueLabelFromSeparatedObjects, getValueLabelFromListAndObject } from "@mixins/utils";
const ResourceSelector = ({}) => {
    const config = useContext(ConfigContext);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedExtra, setSelectedExtra] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [resources, setResources] = useState([]);
    const [extraOptions, setExtraOptions] = useState([]);
    const [timeOptions, setTimeOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);

    const handleResourceChange = (value) => {
        console.log("Resource changed: ", value);
        const extra_options = getValueLabelFromListAndObject(config.schema.options[value].extra, config.schema.labels.extra);
        const time_options = getValueLabelFromListAndObject(config.schema.options[value].time, config.schema.labels.time)
        const user_options = getValueLabelFromListAndObject(config.schema.options[value].user, config.schema.labels.user);
        setSelectedResource(value);
        setTimeOptions(time_options);
        setExtraOptions(extra_options);
        setUserOptions(user_options);

          
    }

    const handleExtraChange = (value) => {
        console.log("Extra changed: ", value);
        setSelectedExtra(value);
    }

    useEffect(() => {
        console.log("Config changed: ", config);
        if (!config) return;
        const resources_data = getValueLabelFromSeparatedObjects(config.schema.options, config.schema.labels.locs);
        console.log("Resources: ", resources_data);
        setResources(resources_data);

    }, [config])

    // const resources = [
    //     { value: "Colegios", label: "Colegios" },
    //     { value: "Hospitales", label: "Hospitales" },
    //     { value: "Farmacias", label: "Farmacias" },
    //     { value: "Supermercados", label: "Supermercados" },
    //     { value: "Bancos", label: "Bancos" },
    //     { value: "Paradas de bus", label: "Paradas de bus" },
    //     { value: "Paradas de metro", label: "Paradas de metro" },
    //     { value: "Parques", label: "Parques" },
    // ]

    

    return (
        <div className="w-80 flex flex-col gap-5">
            <div className="flex gap-5">
                <SelectComponent items={resources} onChange={handleResourceChange} selectedValue={selectedResource} />
                { selectedResource && extraOptions && <SelectComponent items={extraOptions} onChange={handleExtraChange} selectedValue={selectedExtra} /> }
            </div>
            { selectedResource && timeOptions && userOptions && <div className="flex gap-5"> 
                <SelectComponent items={timeOptions} selectedValue={selectedTime} />
                <SelectComponent items={userOptions} selectedValue={selectedUser} />
                </div>}

            <ExecuteBtn />
        </div>

    );
}

export default ResourceSelector;