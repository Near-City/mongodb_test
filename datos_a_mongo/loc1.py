import pandas as pd
from pandas_geojson import to_geojson
import pymongo

def get_geojson(recursos):
    df_EDU = df[df["Denominacion_Generica_ES"].isin(recursos)]
    df_EDU_json = to_geojson(df=df_EDU, lat='lat', lon='long',
                          properties=["Denominacion_Generica_ES", "Regimen", "Localidad", "Denominacion"])
    return df_EDU_json


myclient = pymongo.MongoClient("mongodb://localhost:27017/")
db_destinos = myclient["destinos"]

df = pd.read_excel(r"D:\Datos\Destinos\EDU1.xls")
df = df[["Denominacion_Generica_ES", "Regimen", "Localidad", "Denominacion", "long", "lat"]]

locs1 = ['COLEGIO DE EDUCACIÓN INFANTIL Y PRIMARIA',
             'CENTRO PRIVADO DE EDUCACIÓN INFANTIL Y PRIMARIA',
             'CENTRO PRIVADO DE EDUCACIÓN INFANTIL, PRIMARIA Y SECUNDARIA',
             'CENTRO PRIVADO DE EDUCACIÓN INFANTIL',
             'CENTRO PRIVADO DE EDUCACIÓN INFANTIL Y SECUNDARIA',
             'ESCUELA INFANTIL DE PRIMER CICLO',
             'ESCUELA INFANTIL',
             'CENTRO PRIVADO DE EDUCACIÓN INFANTIL DE PRIMER CICLO']

df_LOC1_json = get_geojson(locs1)

loc1 = db_destinos["LOC_1"]
loc1.insert_one(df_LOC1_json)
#geojson_loc1 = list(loc1.find({}))[0]