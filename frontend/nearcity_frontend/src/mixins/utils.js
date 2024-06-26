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