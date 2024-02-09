import geopandas as gpd
import json
import os
import pymongo
import random
import pandas as pd

from shapely import Polygon, MultiPolygon, wkt
from shapely.ops import unary_union

project_folder = r"C:\Users\aidaa\OneDrive\Escritorio\Proyecto_Missions"

#shapefiles
df_distritos = gpd.read_file(r"C:\Users\aidaa\OneDrive\Escritorio\Proyecto_Missions\Datos\areas_estudio\distritos\distritos.shp")
df_barrios = gpd.read_file(r"C:\Users\aidaa\OneDrive\Escritorio\Proyecto_Missions\Datos\areas_estudio\barrios\barrios.shp")
df_secciones = gpd.read_file(r"C:\Users\aidaa\OneDrive\Escritorio\Proyecto_Missions\Datos\areas_estudio\secciones\secciones.shp")

#geoJSON
df_distritos.to_file(r"{}\Datos\areas_estudio\geoJSON\distritos.geojson".format(project_folder), driver='GeoJSON', crs="EPSG:4326")
df_barrios.to_file(r"{}\Datos\areas_estudio\geoJSON\barrios.geojson".format(project_folder), driver='GeoJSON', crs="EPSG:4326")
df_secciones.to_file(r"{}\Datos\areas_estudio\geoJSON\secciones.geojson".format(project_folder), driver='GeoJSON', crs="EPSG:4326")


def cargar_KPIs():
    dict_aux = {"normativa": {"pie": [random.randint(0,100) for i in range(5)],
                              "bus":  [random.randint(0,100) for i in range(5)],
                              "metro":  [random.randint(0,100) for i in range(5)],
                              "bici": [random.randint(0,100) for i in range(5)], 
                              "coche": [random.randint(0,100) for i in range(5)]},
                "reducida": {"pie": [random.randint(0,100) for i in range(5)],
                             "bus":  [random.randint(0,100) for i in range(5)],
                             "metro":  [random.randint(0,100) for i in range(5)],
                             "bici": [random.randint(0,100) for i in range(5)],
                             "coche": [random.randint(0,100) for i in range(5)]},
                "avanzada": {"pie": [random.randint(0,100) for i in range(5)],
                             "bus":  [random.randint(0,100) for i in range(5)],
                             "metro":  [random.randint(0,100) for i in range(5)],
                             "bici": [random.randint(0,100) for i in range(5)], 
                             "coche": [random.randint(0,100) for i in range(5)]}}
    return

def cargar_coleccion_areas_estudio(db, nivel):
    area = db[nivel]
    path = r"{}\Datos\areas_estudio\geoJSON\{}.geojson".format(project_folder,nivel)
    with open(path, encoding="utf8") as f:
        d = json.load(f)
    for i in range(len(d["features"])):
        #Codificacion del area
        dict_cod = {"cod":d["features"][i]["properties"]}
        #Geometria del area
        dict_geometry = d["features"][i]["geometry"]
        
        if dict_geometry["type"] == "Polygon":
            dict_geometry["coordinates"] = dict_geometry["coordinates"][0]
            
        elif dict_geometry["type"] == "MultiPolygon":
            lista_coordenadas = []
            for i in dict_geometry["coordinates"]:
                for j in i:
                    lista_coordenadas.append([(k) for k in j])
            
            dict_geometry["coordinates"] =  lista_coordenadas
            #dict_geometry["coordinates"] =  [k  for i in dict_geometry["coordinates"] for j in i for k in j]
        
        dict_geometry = {"geometry":dict_geometry}
        #Valores de los indicadores
        dict_KPIs = {"KPIs": {"K1":cargar_KPIs(), 
                              "K2":cargar_KPIs()
                             }}

        dict_total = {**dict_cod, **dict_geometry, **dict_KPIs}
        result = area.insert_one(dict_total)


client = pymongo.MongoClient('mongodb://localhost:27017/')
db_areas = client['areas']
cargar_coleccion_areas_estudio(db_areas, "secciones")
cargar_coleccion_areas_estudio(db_areas, "barrios")
cargar_coleccion_areas_estudio(db_areas, "distritos")
client.close()