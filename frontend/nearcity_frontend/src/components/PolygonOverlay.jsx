import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import * as d3 from 'd3';
import ConfigContext from '@contexts/configContext';

const PolygonOverlay = forwardRef(({ geojsonData, indicator }, ref) => {
  const map = useMap();
  const layerGroupRef = useRef(L.layerGroup());
  const config = useContext(ConfigContext);

  useImperativeHandle(ref, () => ({
    getLayer: () => layerGroupRef.current
  }));

  useEffect(() => {
    if (!geojsonData) return;

    console.log(geojsonData)
    // Clear the current layer group
    layerGroupRef.current.clearLayers();

    const svgLayer = L.svg({ interactive: true });
    layerGroupRef.current.addLayer(svgLayer).addTo(map);

    const svg = d3.select(svgLayer._container).select('g').attr('class', 'leaflet-zoom-hide');
    svg.attr('pointer-events', 'auto');

    const colorScale = d3.scaleSequential().domain([0, 1]).interpolator(d3.interpolateBlues);

    const projectPoint = function(x, y) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    const getColor = (d) => {
      if (!config || !d.properties.area_id || !indicator || !indicator[d.properties.area_id]) return 1;
      console.log(indicator[d.properties.area_id])
      return "#0000ff";
    };


    // const getColor = (d) => {
    //   if (!d.properties.area_id || !indicator || !indicator[d.properties.area_id]) return 1;
    //   const value = indicator[d.properties.area_id] * 10;
    //   console.log(indicator)
    //   console.log(d.properties.area_id)
    //   return colorScale(value);
    // };

    const feature = svg.selectAll("path")
      .data(geojsonData.features)
      .join("path")
        .attr("d", path)
        .attr("fill", getColor)
        .attr("fill-opacity", 0.8)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("class", "leaflet-interactive")
        .on("mouseover", function() {
          d3.select(this).attr("fill-opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill-opacity", 0.8);
        });

    const update = () => {
      feature.attr("d", path);
    };

    map.on('zoomend viewreset moveend', update);

    return () => {
      map.off('zoomend viewreset moveend', update);
      svgLayer.remove();
    };
  }, [geojsonData, map, indicator]);

  return null;
});

PolygonOverlay.displayName = 'PolygonOverlay';

export default PolygonOverlay;
