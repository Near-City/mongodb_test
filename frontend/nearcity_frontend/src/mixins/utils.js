export function inRange(numero, [min, max]) {
    return numero >= min && numero <= max;
}


export function getValueLabelFromSeparatedObjects(options, labels) {
    return Object.keys(options).map((key) => {
        return { value: key, label: labels[key] };
    });
}

export function getValueLabelFromListAndObject(options, labels) {
    // options is a list
    return options.map((key) => {
        console.log("Key: ", key);
        return { value: key, label: labels[key] };
    });
}

export function getAreaIdsFromData(data) {
    // data es un array, quiero devolver un array con la propiedad id de cada elemento
    return data.map((item) => item.properties.area_id);
}

export const find_polygon_with_area_id = (geojsonData, area_id) => {
    for (let i = 0; i < geojsonData.features.length; i++) {
      if (geojsonData.features[i].properties.area_id === area_id) {
        return geojsonData.features[i];
      }
    }
  };