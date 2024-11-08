import { React, useContext, useEffect } from "react";
import CurrentInfoContext from "@contexts/currentInfoContext";
import { get_indicators } from "@api/geo";
import ConfigContext from "@contexts/configContext";
import CurrentIndicatorContext from "@contexts/indicatorContext";

const IndicatorsManager = () => {
  const indicatorParams = ["resource", "extra", "time", "user", "red"];
  const config = useContext(ConfigContext);
  const { currentInfo, setCurrentInfo } = useContext(CurrentInfoContext);
  const { currentIndicator, setCurrentIndicator } = useContext(
    CurrentIndicatorContext
  );

  const checkEveryParam = (indicator) => {
    return indicatorParams.every((param) => indicator[param]);
  };

  const requestIndicators = async (indicator) => {
    if (!indicator || !checkEveryParam(indicator)) return;
    console.log("Requesting indicators for: ", indicator);
    let resource = indicator.resource;
    let extra = indicator.extra;
    let time = indicator.time;
    let user = indicator.user;
    let red = indicator.red;
    const area = currentInfo.area ? currentInfo.area : config.defaults.polygon;
    const area_ids = currentInfo.area_ids ? currentInfo.area_ids : [];
    const indicators = get_indicators(
      area,
      resource,
      extra,
      time,
      user,
      red,
      area_ids
    )
      .then((data) => {
        console.log("Indicators: ", data);
        return data;
      })
      .catch((error) => {
        console.error("Error requesting indicators: ", error);
      });

    console.log("Indicators: ", indicators);
    return indicators;
  };

  useEffect(() => {
    if (!currentInfo?.indicators) return;
    const indicators = currentInfo.indicators || {};
    const primaryIndicator = indicators.primary || {};
    const secondaryIndicator = indicators.secondary || {};

    if (checkEveryParam(primaryIndicator)) {
      console.log("Primary indicator is complete: ", primaryIndicator);
      requestIndicators(primaryIndicator).then((data) => {
        if (data) {
          setCurrentIndicator(data);
          setCurrentInfo({ ...currentInfo, indicatorStatus: "loaded" });
        }
      });
    }
  }, [currentInfo.indicators]);

  useEffect(() => {
    if (
      !currentInfo ||
      !currentInfo.indicators ||
      !currentInfo.area ||
      (currentInfo.area_ids && !config.polygons[currentInfo.area].lazyLoading)
    ) {
      console.log("No need to re-query indicator");
      return;
    }
    console.log("Re-Querying Indicator with Area: ", currentInfo);
    requestIndicators(currentInfo.indicators.primary).then((data) => {
      if (data) {
        setCurrentIndicator(data);
        setCurrentInfo({ ...currentInfo, indicatorStatus: "loaded" });
      }
    });
  }, [currentInfo.area, currentInfo.area_ids]);

  return null;
};

export default IndicatorsManager;
