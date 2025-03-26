import SelectComponent from "@components/uiMapComponents/Selects/SelectComponente";
import React from "react";
import { useEffect, useState, useContext } from "react";
import ExecuteBtn from "@components/Buttons/ExecuteBtn";
import ConfigContext from "@contexts/configContext";

import CurrentInfoContext from "@contexts/currentInfoContext";
import {
  getValueLabelFromSeparatedObjects,
  getValueLabelFromListAndObject,
} from "@mixins/utils";

import { get_indicators } from "@api/geo";
import { updateIndicatorInCurrentInfo } from "@mixins/currentInfoUtils";

const ResourceSelector = ({ setIndicator, indicatorName = "primary" }) => {
  const config = useContext(ConfigContext);
  
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);

  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRed, setSelectedRed] = useState(null);

  const [resources, setResources] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [redOptions, setRedOptions] = useState([]);


  const getIndicatorPropertyInCurrentInfo = (indicatorName, indicatorProperty) => {
    if (!currentInfo || !currentInfo.indicators) return null;
    const indicators = currentInfo.indicators || {};
    const indicator = indicators[indicatorName] || {};
    return indicator[indicatorProperty];
  };

  const selectOptionsWithSavedInfo = () => {
    const resource = getIndicatorPropertyInCurrentInfo(indicatorName, "resource");
    const extra = getIndicatorPropertyInCurrentInfo(indicatorName, "extra");
    const time = getIndicatorPropertyInCurrentInfo(indicatorName, "time");
    const user = getIndicatorPropertyInCurrentInfo(indicatorName, "user");
    const red = getIndicatorPropertyInCurrentInfo(indicatorName, "red");

    if (resource) setSelectedResource(resource);
    if (extra) setSelectedExtra(extra);
    if (time) setSelectedTime(time);
    if (user) setSelectedUser(user);
    if (red) setSelectedRed(red);
  };


  const refreshOptionsOnResource = (resourceValue) => {
    const extra_options = getValueLabelFromListAndObject(
      config.schema.options[resourceValue].extra,
      config.schema.labels.extra
    );
    const time_options = getValueLabelFromListAndObject(
      config.schema.options[resourceValue].time,
      config.schema.labels.time
    );
    const user_options = getValueLabelFromListAndObject(
      config.schema.options[resourceValue].user,
      config.schema.labels.user
    );
    const red_options = getValueLabelFromListAndObject(
      config.schema.options[resourceValue].red,
      config.schema.labels.red
    );

    setTimeOptions(time_options);
    setExtraOptions(extra_options);
    setUserOptions(user_options);
    setRedOptions(red_options);
  };

  const handleResourceChange = (value) => {
    console.log("Resource changed: ", value);
    refreshOptionsOnResource(value);

    setSelectedResource(value);
      updateIndicatorInCurrentInfo(setCurrentInfo,indicatorName, "resource", value);
    };

  const handleExtraChange = (value) => {
    console.log("Extra changed: ", value);
    setSelectedExtra(value);
    updateIndicatorInCurrentInfo(setCurrentInfo,indicatorName, "extra", value);
  };

  const handleTimeChange = (value) => {
    console.log("Time changed: ", value);
    setSelectedTime(value);
    updateIndicatorInCurrentInfo(setCurrentInfo,indicatorName, "time", value);
  };

  const handleUserChange = (value) => {
    console.log("User changed: ", value);
    setSelectedUser(value);
    updateIndicatorInCurrentInfo(setCurrentInfo,indicatorName, "user", value);
  };

  const handleRedChange = (value) => {
    console.log("Red changed: ", value);
    setSelectedRed(value);
    updateIndicatorInCurrentInfo(setCurrentInfo,indicatorName, "red", value);
  };


  useEffect(() => {
    if (!config) return;
    const resources_data = getValueLabelFromSeparatedObjects(
      config.schema.options,
      config.schema.labels.locs
    );
    setResources(resources_data);

    // Si ya tengo valores guardados previos en currentInfo, no es necesario escoger el primer valor por defecto
    let prevResource = getIndicatorPropertyInCurrentInfo(indicatorName, "resource");
    let resource = prevResource || resources_data[0].value;
    refreshOptionsOnResource(resource);

    if (prevResource) selectOptionsWithSavedInfo();
    else handleResourceChange(resource); // Seleccionar el primer recurso por defecto
  }, [config]);

  // useEffect(() => {
  //   if (!currentInfo || !currentInfo.area || (currentInfo.area_ids && !config.polygons[currentInfo.area].lazyLoading)) 
  //     {
  //       console.log("No need to re-query indicator");
  //       return;}
  //   console.log("Re-Querying Indicator with Area: ", currentInfo);
  //   executeQuery();
  // }, [currentInfo.area, currentInfo.area_ids]);

  useEffect(() => {
    if (extraOptions.length > 0 && !selectedExtra)
      handleExtraChange(extraOptions[0].value);
    if (timeOptions.length > 0 && !selectedTime)
      handleTimeChange(timeOptions[0].value);
    if (userOptions.length > 0 && !selectedUser)
      handleUserChange(userOptions[0].value);
    if (redOptions.length > 0 && !selectedRed)
      handleRedChange(redOptions[0].value);
  }, [extraOptions, timeOptions, userOptions, redOptions]);



  return (
    <div className="w-80 flex flex-col gap-5">
  {/* Primera fila */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <SelectComponent
      items={resources}
      onChange={handleResourceChange}
      selectedValue={selectedResource}
    />
    {selectedResource && extraOptions && (
      <SelectComponent
        items={extraOptions}
        onChange={handleExtraChange}
        selectedValue={selectedExtra}
      />
    )}
  </div>

  {/* Segunda fila */}
  {selectedResource && timeOptions && userOptions && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SelectComponent
        items={timeOptions}
        selectedValue={selectedTime}
        onChange={handleTimeChange}
      />
      <SelectComponent
        items={userOptions}
        selectedValue={selectedUser}
        onChange={handleUserChange}
      />
    </div>
  )}

  {/* Tercera fila */}
  {selectedResource && redOptions && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SelectComponent
        items={redOptions}
        selectedValue={selectedRed}
        onChange={handleRedChange}
      />
    </div>
  )}


</div>

  );
};

export default ResourceSelector;
