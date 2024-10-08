import SelectComponent from "@components/uiMapComponents/Selects/SelectComponente";
import React from "react";
import { useEffect, useState, useContext } from "react";
import ExecuteBtn from "@components/Buttons/ExecuteBtn";
import ConfigContext from "@contexts/configContext";
import CurrentIndicatorContext from "@contexts/indicatorContext";
import CurrentInfoContext from "@contexts/currentInfoContext";
import {
  getValueLabelFromSeparatedObjects,
  getValueLabelFromListAndObject,
} from "@mixins/utils";

import { get_indicators } from "@api/geo";

const ResourceSelector = () => {
  const config = useContext(ConfigContext);
  const { currentIndicator, setCurrentIndicator } = useContext(
    CurrentIndicatorContext
  );
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

  const handleResourceChange = (value) => {
    console.log("Resource changed: ", value);
    const extra_options = getValueLabelFromListAndObject(
      config.schema.options[value].extra,
      config.schema.labels.extra
    );
    const time_options = getValueLabelFromListAndObject(
      config.schema.options[value].time,
      config.schema.labels.time
    );
    const user_options = getValueLabelFromListAndObject(
      config.schema.options[value].user,
      config.schema.labels.user
    );
    const red_options = getValueLabelFromListAndObject(
      config.schema.options[value].red,
      config.schema.labels.red
    );
    // Actualiza las opciones dependiendo del recurso seleccionado
    setSelectedResource(value);
    setTimeOptions(time_options);
    setExtraOptions(extra_options);
    setUserOptions(user_options);
    setRedOptions(red_options);
    setCurrentInfo({ ...currentInfo, resource: value });


    if (extra_options.length > 0 && !selectedExtra)
      setSelectedExtra(extra_options[0].value);
    if (time_options.length > 0 && !selectedTime)
      setSelectedTime(time_options[0].value);
    if (user_options.length > 0 && !selectedUser)
      setSelectedUser(user_options[0].value);
    if (red_options.length > 0 && !selectedRed)
      setSelectedRed(red_options[0].value);
  };

  const handleExtraChange = (value) => {
    console.log("Extra changed: ", value);
    setSelectedExtra(value);
    setCurrentInfo({ ...currentInfo, extra: value });
  };

  const handleTimeChange = (value) => {
    console.log("Time changed: ", value);
    setSelectedTime(value);
    setCurrentInfo({ ...currentInfo, time: value });
  };

  const handleUserChange = (value) => {
    console.log("User changed: ", value);
    setSelectedUser(value);
    setCurrentInfo({ ...currentInfo, user: value });
  };

  const handleRedChange = (value) => {
    console.log("Red changed: ", value);
    setSelectedRed(value);
    setCurrentInfo({ ...currentInfo, red: value });
  };

  useEffect(() => {
    if (!currentInfo) return;
    
    if (currentInfo.resource) setSelectedResource(currentInfo.resource);
    if (currentInfo.extra) setSelectedExtra(currentInfo.extra);
    if (currentInfo.time) setSelectedTime(currentInfo.time);
    if (currentInfo.user) setSelectedUser(currentInfo.user);
    if (currentInfo.red) setSelectedRed(currentInfo.red);
  }, []);

  useEffect(() => {
    console.log("Config changed: ", config);
    if (!config) return;
    const resources_data = getValueLabelFromSeparatedObjects(
      config.schema.options,
      config.schema.labels.locs
    );
    console.log("Resources: ", resources_data);
    setResources(resources_data);
    handleResourceChange(resources_data[0].value);
  }, [config]);

  useEffect(() => {
    if (!currentInfo || !currentInfo.area || (currentInfo.area_ids && !config.polygons[currentInfo.area].lazyLoading)) return;
    console.log("Re-Querying Indicator with Area: ", currentInfo);
    executeQuery();
  }, [currentInfo.area, currentInfo.area_ids]);

  const checkEveryParam = () => {
    if (
      selectedResource &&
      selectedExtra &&
      selectedTime &&
      selectedUser &&
      selectedRed
    )
      return true;

    console.log("Missing parameters", {
      selectedResource,
      selectedExtra,
      selectedTime,
      selectedUser,
      selectedRed,
    });
    return false;
  };

  const executeQuery = () => {
    if (!checkEveryParam()) return;
    setCurrentIndicator(null);
    console.log("Executing query");
    console.log("Resource: ", selectedResource);
    console.log("Extra: ", selectedExtra);
    console.log("Time: ", selectedTime);
    console.log("User: ", selectedUser);
    console.log("Red: ", selectedRed);
    const area = currentInfo.area ? currentInfo.area : config.defaults.polygon;
    const area_ids = currentInfo.area_ids ? currentInfo.area_ids : [];
    console.log("Area IDS: ", area_ids);
    console.log("Area: ", area);
    get_indicators(
      area,
      selectedResource,
      selectedExtra,
      selectedTime,
      selectedUser,
    selectedRed,
      area_ids
    )
      .then((data) => {
        console.log(
          "NUEVO INDICADOR: ",
          area,
          selectedResource,
          selectedExtra,
          selectedTime,
          selectedUser,
          selectedRed,
          area_ids
        );

        setCurrentInfo({ ...currentInfo, indicatorStatus: "loaded" });
        setCurrentIndicator(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

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
  {selectedResource && selectedTime && selectedUser && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SelectComponent
        items={redOptions}
        selectedValue={selectedRed}
        onChange={handleRedChange}
      />
    </div>
  )}

  <ExecuteBtn onClick={executeQuery} />
</div>

  );
};

export default ResourceSelector;
