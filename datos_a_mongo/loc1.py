import pandas as pd
from pandas_geojson import to_geojson
import pymongo
from urllib.parse import quote_plus


def get_geojson(recursos):
    df_EDU = df[df["Denominacion_Generica_ES"].isin(recursos)]
    df_EDU_json = to_geojson(df=df_EDU, lat='lat', lon='long',
                          properties=["Denominacion_Generica_ES", "Regimen", "Localidad", "Denominacion"])
    return df_EDU_json



# Configuración de las credenciales y la conexión a MongoDB
mongodb_host = "172.17.0.2"
mongodb_port = 27017
mongodb_username = quote_plus("root")
mongodb_password = quote_plus("M0ng0@DJ.,")
database_name = "destinos"

# Establecer la conexión a MongoDB
client = pymongo.MongoClient(
    f"mongodb://{mongodb_username}:{mongodb_password}@{mongodb_host}:{mongodb_port}/{database_name}?authSource=admin"
)

# Obtener la base de datos
db_destinos = client[database_name]



df = pd.read_excel(r"/var/www/vhosts/dj-pruebas.upv.es/datos/Destinos/EDU1.xls")
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