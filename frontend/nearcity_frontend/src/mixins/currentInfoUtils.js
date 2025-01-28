export const setViewInfo = (currentInfo, setCurrentInfo, text, onClose) => {
  setCurrentInfo({
    ...currentInfo,
    viewInfo: { text: text, onClose: onClose },
  });
};

export const removeViewInfo = (currentInfo, setCurrentInfo) => {
  setCurrentInfo({ ...currentInfo, viewInfo: null });
};

export const updateIndicatorInCurrentInfo = (
  setCurrentInfo,
  indicatorName,
  indicatorProperty,
  value
) => {
  console.log(
    "Updating indicator in current info: ",
    indicatorName,
    indicatorProperty,
    value
  );
  setCurrentInfo((prevState) => {
    const indicators = prevState.indicators || {};
    const indicator = indicators[indicatorName] || {};
    return {
      ...prevState,
      indicators: {
        ...indicators,
        [indicatorName]: {
          ...indicator,
          [indicatorProperty]: value,
        },
      },
    };
  });
};
