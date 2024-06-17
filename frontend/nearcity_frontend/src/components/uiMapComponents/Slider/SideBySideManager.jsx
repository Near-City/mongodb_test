import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import PolygonOverlay from "@components/PolygonOverlay";
import * as d3 from "d3";

const SideBySideManager = ({ geojsonData, leftIndicator, rightIndicator }) => {
  const map = useMap();
  const [dividerPosition, setDividerPosition] = useState(window.innerWidth / 2);
  const dividerRef = useRef(null);

  useEffect(() => {
    const updateDivider = (e) => {
      setDividerPosition(e.clientX);
    };

    const stopDragging = () => {
      window.removeEventListener("mousemove", updateDivider);
      window.removeEventListener("mouseup", stopDragging);
      map.dragging.enable(); // Re-enable map dragging
    };

    const startDragging = (e) => {
      e.preventDefault();
      window.addEventListener("mousemove", updateDivider);
      window.addEventListener("mouseup", stopDragging);
      map.dragging.disable(); // Disable map dragging while dragging the divider
    };

    if (dividerRef.current) {
      dividerRef.current.addEventListener("mousedown", startDragging);
    }

    return () => {
      if (dividerRef.current) {
        dividerRef.current.removeEventListener("mousedown", startDragging);
      }
    };
  }, [map]);

  const updateClipPaths = () => {
    const svg = d3.select(map.getPanes().overlayPane).select("svg");
    let defs = svg.select("defs");
    if (defs.empty()) {
      defs = svg.append("defs");
    }

    defs.selectAll("clipPath").remove();

    defs.append("clipPath")
      .attr("id", "clip-left")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", dividerPosition)
      .attr("height", window.innerHeight);

    defs.append("clipPath")
      .attr("id", "clip-right")
      .append("rect")
      .attr("x", dividerPosition)
      .attr("y", 0)
      .attr("width", window.innerWidth - dividerPosition)
      .attr("height", window.innerHeight);
  };

  useEffect(() => {
    updateClipPaths();
    map.on('moveend', updateClipPaths);

    return () => {
      map.off('moveend', updateClipPaths);
    };
  }, [dividerPosition, map]);

  return (
    <>
      <div
        ref={dividerRef}
        style={{
          position: "absolute",
          top: 0,
          left: dividerPosition - 2,
          width: "4px",
          height: "100%",
          backgroundColor: "black",
          cursor: "ew-resize",
          zIndex: 1000
        }}
      />
      <PolygonOverlay geojsonData={geojsonData} indicator={leftIndicator} clipPathId="clip-left" />
      <PolygonOverlay geojsonData={geojsonData} indicator={rightIndicator} clipPathId="clip-right" />
    </>
  );
};

export default SideBySideManager;
