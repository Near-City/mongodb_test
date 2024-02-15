import { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { getBarrios, getDistritos, getSecciones } from '../api/geo.js'



function Dashboard() {
  const [barrios, setBarrios] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  // Sacar los datos de la API sobre los BARRIOS
  useEffect(() => {
    getBarrios().then((data) => {
      data.title = 'Barrios';
      setBarrios(data);
      
    });
  }, []);

  // Sacar los datos de la API sobre los DISTRITOS
  useEffect(() => {
    getDistritos().then((data) => {
      data.title = 'Distritos';
      setDistritos(data);
      
    });
  }, []);

  // Sacar los datos de la API sobre las SECCIONES
  useEffect(() => {
    getSecciones().then((data) => {
      data.title = 'Secciones';
      setSecciones(data);
      
    });
  }, []);

  function handleDataChange(data) {
    console.log(data);
    setCurrentTitle(data);
  }

  return (
    <>
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl">{currentTitle}</h1>
      </div>
    </header>
      <section className="flex justify-center items-center">

        { secciones.length > 0 &&
          barrios.length > 0 &&
          distritos.length > 0 &&
        <MapComponent 
        onDataChanged={handleDataChange}
        dataDistritos={distritos} dataBarrios={barrios} dataSecciones={secciones}/> }
      </section>
    </>
  );
}

export default Dashboard;
