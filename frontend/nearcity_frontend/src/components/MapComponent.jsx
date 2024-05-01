import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import proj4 from 'proj4';
import { generateRandomKpi } from '../mixins/geotools.js'
import MapToolTip from './MapToolTip';
import FloatingToolbar from './FloatingToolBar.jsx';
// Definiciones de proj4 para la conversión
proj4.defs('EPSG:25830', '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs');



const MapComponent = ({ dataDistritos, dataBarrios, dataSecciones, onDataChanged }) => {
  const svgRef = useRef();
  const [currentData, setCurrentData] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, data: null });
  const [zoomLevel, setZoomLevel] = useState(1); // [1, 10]
  const zoom = useRef(d3.zoom()); // Almacena la referencia del zoom en useRef
  const distritosZoom = 1;
  const barriosZoom = 3.33;
  const seccionesZoom = 6.66;

  const convertCoordinates = (geometry) => {
    // Función para convertir un único par de coordenadas
    const convertPair = (pair) => {
      const [x, y] = pair.map(Number);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error(`Coordenada no es un número finito: ${pair}`);
      }
      const [longitude, latitude] = proj4('EPSG:25830', 'WGS84', [x, y]);
      return [longitude, latitude];
    };
  
    if (geometry.type === 'Polygon') {
      // Un Polygon tiene un arreglo de coordenadas (tuplas de 2 elementos)
      return geometry.coordinates.map(convertPair);
    } else if (geometry.type === 'MultiPolygon') {
      console.log('multipolygon')
      // Un MultiPolygon tiene una lista de listas de coordenadas (tuplas de 2 elementos)
      return geometry.coordinates.map(polygon => polygon.map(convertPair));
    } else {
      throw new Error(`Tipo de geometría no soportado: ${geometry.type}`);
    }
  };
  
  const handleZoomLevelChanged = (scale) => {
    setZoomLevel(scale);
    if (scale >= distritosZoom && scale < barriosZoom) {
      setCurrentData(dataDistritos);
    } else if (scale >= barriosZoom && scale < seccionesZoom) {
      setCurrentData(dataBarrios);
    } else if (scale >= seccionesZoom) {
      setCurrentData(dataSecciones);
    }
  };

  const getStrokeWidth = (zoomLevel) => { // A más zoom, menos ancho de línea
    return 2/zoomLevel;
  }

   // Función para cambiar el nivel de zoom programáticamente
   function setZoom(level, duration = 500) {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const transform = d3.zoomIdentity.translate(width / 2, height / 2).scale(level).translate(-width / 2, -height / 2);

    svg.transition()
      .duration(duration)
      .call(zoom.current.transform, transform);
  }

  
  // me he quedado en que no muestra nada, por culpa de los multipolygons

  // Controlar el formato del GeoJSON y dibujar el Mapa
  useEffect(() => {
    if (!currentData && dataDistritos) {
      console.log('setting current data')
      setCurrentData(dataDistritos);
    } 
    if (currentData && svgRef.current) {
      onDataChanged(currentData?.title);
      const width = 1900;
      const height = 800;
      const svg = d3.select(svgRef.current);

      svg.attr('width', width).attr('height', height);
  
      const container = svg.selectAll('g.map-container');
      // Preparar los datos GeoJSON
      /*
      REVISAR:
      CADA VEZ QUE SE CAMBIAN LOS DATOS, SE ESTÁN TRANSFORMANDO LAS COORDENADAS, ESTO PODRÍA HACERSE UNA SOLA VEZ Y GUARDARSE LOS DATOS 
      TRANSFORMADOS EN UNA VARIABLE GLOBAL, PARA NO TENER QUE HACERLO CADA VEZ QUE SE CAMBIA DE NIVEL DE ZOOM
      
      */ 

      const features = currentData.map(item => ({
        type: "Feature",
        properties: {
          cod: item.cod, // Metadatos
          KPIs: {
            'K1': generateRandomKpi(),
            'K2': generateRandomKpi(),
          }
        },
        geometry: {
          type: item.geometry.type,
          coordinates: [convertCoordinates(item.geometry)] // Asegúrate de que esto retorne el formato correcto
        }
      }));
  
      const geoJsonData = {
        type: "FeatureCollection",
        features: features
      };
  
      // Configurar proyección, pathGenerator y colorScale
      const projection = d3.geoMercator().fitSize([width, height], geoJsonData);
      const pathGenerator = d3.geoPath().projection(projection);
      const colorScale = d3.scaleSequential().domain([0, 1]).interpolator(d3.interpolateBlues); // Ajusta según necesidades
  
      // Transición suave para eliminar los caminos existentes
      container.selectAll('path')
        .data(features, d => d.properties) // Usar una clave única si es posible
        .exit()
        .transition()
        .duration(500)
        .attr("opacity", 0)
        .remove();
  
      // Introduce nuevos caminos con una transición
      const paths = container.selectAll('path')
        .data(features, d => d.properties)
        .enter()
        .append('path')
        .attr('d', pathGenerator)
        .attr('fill', d => colorScale(d.properties.KPIs.K1))
        .attr('stroke', 'white')
        .attr('stroke-width', function(d) { return getStrokeWidth(zoomLevel);})
        .attr("opacity", 0); // Inicia con opacidad 0
  
      paths.transition()
        .duration(500)
        .attr("opacity", 1); // Transición a opacidad 1
      
      d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };
        
      // Eventos de ratón para interactividad
      paths.on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
        .moveToFront()
        .attr('stroke', 'black')
        .attr('stroke-width', function(d) { return getStrokeWidth(zoomLevel);})
        setTooltip({
          visible: true,
          data: d.properties, // Aquí asumimos que las propiedades contienen la información para el tooltip
          position: { x: event.clientX, y: event.clientY }
        });
      })
      .on('mousemove', (event, d) => {
        setTooltip({
          visible: true,
          data: d.properties, // Aquí asumimos que las propiedades contienen la información para el tooltip
          position: { x: event.clientX, y: event.clientY }
        });
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', 'white')
          .attr('stroke-width', function(d) { return getStrokeWidth(zoomLevel);})
        setTooltip({ visible: false, data: null });
      });
    }
  }, [currentData]); // Asegúrate de incluir todas las dependencias necesarias
  

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Asegura que el contenedor del mapa esté presente
    const container = svg.selectAll('g.map-container')
      .data([null]); // Solo queremos un contenedor
    container.enter().append('g').classed('map-container', true);


    zoom.current
      .scaleExtent([1, 10]) // Ajusta según necesidades
      .on('zoom', (event) => {
        const { transform } = event;
        handleZoomLevelChanged(transform.k);
        container.attr('transform', transform);
      });

    svg.call(zoom.current);
  }, []); // Dependencias vacías para que solo se ejecute una vez


  return (
    <div>
      <svg ref={svgRef}></svg>
      {tooltip?.visible && (
        <MapToolTip data={tooltip.data} x={tooltip.position?.x} y={tooltip.position?.y} />
        )
      
      }
      <FloatingToolbar onDistricts={() => setZoom(distritosZoom)} onNeighborhoods={() => setZoom(barriosZoom)} onSections={() => setZoom(seccionesZoom)}/>
    </div>

  
  );
};

export default MapComponent;
