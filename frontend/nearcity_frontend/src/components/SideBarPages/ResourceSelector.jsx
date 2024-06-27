import SelectComponent from "@components/uiMapComponents/Selects/SelectComponente";
import React from 'react';
import { useEffect, useState, useContext } from "react";
import ExecuteBtn from "@components/Buttons/ExecuteBtn";
import ConfigContext from "@contexts/configContext";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import { getValueLabelFromSeparatedObjects, getValueLabelFromListAndObject } from "@mixins/utils";

import { get_indicators } from "@api/geo";

const ResourceSelector = ({}) => {
    const config = useContext(ConfigContext);
    const {currentIndicator, setCurrentIndicator} = useContext(CurrentIndicatorContext);

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

    const handleTimeChange = (value) => {
        console.log("Time changed: ", value);
        setSelectedTime(value);
    }

    useEffect(() => {
        console.log("Config changed: ", config);
        if (!config) return;
        const resources_data = getValueLabelFromSeparatedObjects(config.schema.options, config.schema.labels.locs);
        console.log("Resources: ", resources_data);
        setResources(resources_data);

    }, [config])

    const executeQuery = () => {
        console.log("Executing query");
        console.log("Resource: ", selectedResource);
        console.log("Extra: ", selectedExtra);
        console.log("Time: ", selectedTime);
        console.log("User: ", selectedUser);
        get_indicators("distritos", selectedResource, selectedExtra, selectedTime, selectedUser).then((data) => {
            console.log("NUEVO INDICADOR: ", data);
            console.log("Current indicator: ", currentIndicator);
            setCurrentIndicator(data);
        }).catch((error) => {
            console.error("Error fetching data: ", error);
        });
    }
    

    return (
        <div className="w-80 flex flex-col gap-5">
            <div className="flex gap-5">
                <SelectComponent items={resources} onChange={handleResourceChange} selectedValue={selectedResource} />
                { selectedResource && extraOptions && <SelectComponent items={extraOptions} onChange={handleExtraChange} selectedValue={selectedExtra} /> }
            </div>
            { selectedResource && timeOptions && userOptions && <div className="flex gap-5"> 
                <SelectComponent items={timeOptions} selectedValue={selectedTime} onChange={handleTimeChange} />
                <SelectComponent items={userOptions} selectedValue={selectedUser} />
                </div>}

            <ExecuteBtn onClick={executeQuery}/>
        </div>

    );
}

export default ResourceSelector;