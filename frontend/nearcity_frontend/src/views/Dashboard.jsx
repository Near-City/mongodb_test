import { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import SidePanel from "../components/SidePanel.jsx";
import MapToolbar from "../components/MapToolBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { getBarrios, getDistritos, getSecciones } from "../api/geo.js";

function Dashboard() {
  const [barrios, setBarrios] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [secciones, setSecciones] = useState([]);

  // Los datos dinámicos, es decir, los que pueden ser filtrados y modificados para mostrarlos en el mapa
  const [dinamicBarrios, setDinamicBarrios] = useState([]);
  const [dinamicDistritos, setDinamicDistritos] = useState([]);
  const [dinamicSecciones, setDinamicSecciones] = useState([]);

  const [currentTitle, setCurrentTitle] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(true);

  // Sacar los datos de la API sobre los BARRIOS
  useEffect(() => {
    getBarrios().then((data) => {
      data.title = "Barrios";
      console.log(data);
      setBarrios(data);
      setDinamicBarrios(data);
    });
  }, []);

  // Sacar los datos de la API sobre los DISTRITOS
  useEffect(() => {
    getDistritos().then((data) => {
      data.title = "Distritos";
      console.log(data);
      setDistritos(data);
      setDinamicDistritos(data);
    });
  }, []);

  // Sacar los datos de la API sobre las SECCIONES
  useEffect(() => {
    getSecciones().then((data) => {
      data.title = "Secciones";
      console.log(data);
      setSecciones(data);
      setDinamicSecciones(data);
    });
  }, []);

  function handleDataChange(data) {
    console.log(data);
    setCurrentTitle(data);
  }

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

  function filter(name){
    console.log(name);
    console.log(barrios)
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
      <section className="flex justify-center items-center">
        {secciones.length > 0 && barrios.length > 0 && distritos.length > 0 && (
          <MapComponent
            onDataChanged={handleDataChange}
            dataDistritos={dinamicDistritos}
            dataBarrios={dinamicBarrios}
            dataSecciones={dinamicSecciones}
          />
        )}
        <SidePanel open={openDrawer}  onFilterByName={(name) => {console.log(distritos); filter(name)}} />
      </section>
    </>
  );
}

export default Dashboard;
