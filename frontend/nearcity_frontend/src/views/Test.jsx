import { useEffect, useState } from "react";
import LeafletMapWithD3Overlay from "../components/LeafletMapWithD3Overlay.jsx";
import BaseMap from "../components/BaseMap.jsx";
import SidePanel from "../components/SidePanel.jsx";
import MapToolbar from "../components/MapToolBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";


import { getBarrios, getDistritos, getSecciones, getParcelas } from "../api/geo.js";

function Test() {
  const [barrios, setBarrios] = useState(null);
  const [distritos, setDistritos] = useState(null);
  const [secciones, setSecciones] = useState(null);
  const [parcelas, setParcelas] = useState(null);

  const [currentData, setCurrentData] = useState(null);


  const [currentTitle, setCurrentTitle] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(true);

  const onDataRequested = (id) => {
    console.log("Data requested: ", id);
    
    if (id === "distritos") {
      if (!distritos) updateDistritos();
      setCurrentData(distritos);
    } else if (id === "barrios") {
      if (!barrios) updateBarrios();
      setCurrentData(barrios);
    } else if (id === "secciones") {
      if (!secciones) updateSecciones();
      setCurrentData(secciones);
    } else if (id === "parcelas") {
      // setCurrentData(parcelas);
    }

  };

  const updateDistritos = () => {
    
    getDistritos().then((data) => {
      if (data.length == 0) return;
      data = data[0];
      data.title = "Distritos";
      console.log(data);
      setDistritos(data);
      setCurrentData(data);
    });
  };

  const updateBarrios = () => {

    getBarrios().then((data) => {
      if (data.length == 0) return;
      data = data[0];
      data.title = "Barrios";
      console.log(data);
      setBarrios(data);
      setCurrentData(data);
    }
    );

  };

  const updateSecciones = () => {
    getSecciones().then((data) => {
      if (data.length == 0) return;
      data = data[0];
      data.title = "Secciones";
      console.log(data);
      setSecciones(data);
      setCurrentData(data);
    });
  };

  const updateParcelas = () => {
    getParcelas().then((data) => {
      if (data.length == 0) return;
      data = data[0];
      data.title = "Parcelas";
      console.log(data);
      setParcelas(data);
      setCurrentData(data);
    });
  };
  // Sacar los datos de la API sobre los BARRIOS
  useEffect(() => {
    getBarrios().then((data) => {
      // data.title = "Barrios";
      if (data.length == 0) return;
      data = data[0];
      data.title = "Barrios";
      console.log(data);
      setBarrios(data);
    });
  }, []);

  // Sacar los datos de la API sobre los DISTRITOS
  useEffect(() => {
    getDistritos().then((data) => {
      // data.title = "Distritos";
      if (data.length == 0) return;
      data = data[0];
      data.title = "Distritos";
      console.log(data);
      setDistritos(data);
      setCurrentData(data);
      
    });
  }, []);

  // Sacar los datos de la API sobre las SECCIONES
  useEffect(() => {
    getSecciones().then((data) => {
      // data.title = "Secciones";
      if (data.length == 0) return;
      data = data[0];
      data.title = "Secciones";
      console.log(data);
      setSecciones(data);
      
    });
  }, []);

  // Sacar los datos de la API sobre las PARCELAS
  useEffect(() => {
    getParcelas().then((data) => {
      // data.title = "Parcelas";
      if (data.length == 0) return;
      data = data[0];
      console.log(data);
      
    });
  }, []);



  function filterByName(data, name) {
    return data.filter((item) => {
      if (item.cod.hasOwnProperty("N_DIST")) {
        return item.cod.N_DIST === name;
      } else if (item.cod.hasOwnProperty("N_BAR")) {
        return item.cod.N_BAR === name;
      } else {
        return false;
      }
    });
  }

  function filter(name) {
    console.log(name);
    console.log(barrios);
    // setDinamicBarrios(filterByName(barrios, name));
    // setDinamicDistritos(filterByName(distritos, name));
    // setDinamicSecciones(filterByName(secciones, name));
  }

  return (
    <>
      <TopBar
        onMenuClick={() => {
          setOpenDrawer(!openDrawer);
          console.log(openDrawer);
        }}
      />
      <section className="flex justify-center items-center h-full" >
        {currentData && (
          <BaseMap geojsonData={currentData} requestData={onDataRequested}/>
        )}
        {/* <SidePanel open={openDrawer}  onFilterByName={(name) => {console.log(distritos); filter(name)}} /> */}
      </section>
    </>
  );
}

export default Test;
