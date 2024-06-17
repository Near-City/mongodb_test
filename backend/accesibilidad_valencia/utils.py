def build_geojson_from_features(features):
    return {
        "type": "FeatureCollection",
        "features": features
    }