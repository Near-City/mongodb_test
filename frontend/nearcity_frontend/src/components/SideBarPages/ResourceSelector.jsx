import SelectComponent from "@components/uiMapComponents/Selects/SelectComponente";
import React from 'react';
import { useEffect, useState, useContext } from "react";
import ExecuteBtn from "@components/Buttons/ExecuteBtn";
import ConfigContext from "@contexts/configContext";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { getValueLabelFromSeparatedObjects, getValueLabelFromListAndObject } from "@mixins/utils";

import { get_indicators } from "@api/geo";

const ResourceSelector = ({}) => {
    const config = useContext(ConfigContext);
    const {currentIndicator, setCurrentIndicator} = useContext(CurrentIndicatorContext);
    const {currentInfo, setCurrentInfo} = useContext(CurrentInfoContext);

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
        setCurrentInfo({ ...currentInfo, resource: value });
        
        if (extra_options.length > 0 && !extraOptions) setSelectedExtra(extra_options[0].value);
        if (time_options.length > 0 && !timeOptions) setSelectedTime(time_options[0].value);
        if (user_options.length > 0 && !userOptions) setSelectedUser(user_options[0].value);
          
    }

    const handleExtraChange = (value) => {
        console.log("Extra changed: ", value);
        setSelectedExtra(value);
        setCurrentInfo({ ...currentInfo, extra: value });
    }

    const handleTimeChange = (value) => {
        console.log("Time changed: ", value);
        setSelectedTime(value);
        setCurrentInfo({ ...currentInfo, time: value });
    }

    useEffect(() => {
        if (!currentInfo) return;
        if (currentInfo.resource) setSelectedResource(currentInfo.resource);
        if (currentInfo.extra) setSelectedExtra(currentInfo.extra);
        if (currentInfo.time) setSelectedTime(currentInfo.time);
    }, [])

    useEffect(() => {
        console.log("Config changed: ", config);
        if (!config) return;
        const resources_data = getValueLabelFromSeparatedObjects(config.schema.options, config.schema.labels.locs);
        console.log("Resources: ", resources_data);
        setResources(resources_data);
        handleResourceChange(resources_data[0].value);

    }, [config])

    useEffect(() => {
        if (!currentInfo || !currentInfo.area || !currentIndicator) return;
        console.log("Re-Querying Indicator with Area: ", currentInfo);
        executeQuery();
        
    }, [currentInfo.area, currentInfo.area_ids])

    const executeQuery = () => {
        console.log("Executing query");
        console.log("Resource: ", selectedResource);
        console.log("Extra: ", selectedExtra);
        console.log("Time: ", selectedTime);
        console.log("User: ", selectedUser);
        const area = currentInfo.area ? currentInfo.area : config.defaults.polygon;
        const area_ids = currentInfo.area_ids ? currentInfo.area_ids : [];
        console.log("Area: ", area);
        get_indicators(area, selectedResource, selectedExtra, selectedTime, selectedUser, area_ids).then((data) => {
            console.log("NUEVO INDICADOR: ", area, selectedResource, selectedExtra, selectedTime, selectedUser, area_ids);
            
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