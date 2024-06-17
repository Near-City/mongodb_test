from django.shortcuts import render
from .mongo import get_mongo_connection, get_geospatial_data
from .utils import build_geojson_from_features
# Create your views here.


from django.shortcuts import render
from django.http import JsonResponse
from .mongo import get_mongo_connection
import json
from django.views import View

# Carga del archivo de configuración
with open('accesibilidad_valencia/data/config.json') as f:
    config = json.load(f)

db = get_mongo_connection()

def get_config(request):
    # No enviar nombres de colecciones al frontend
    frontend_config = {
        "polygons": {key: {"code": value["code"]} for key, value in config["polygons"].items()},
        "points": {key: {"code": value["code"]} for key, value in config["points"].items()}
    }
    data = jsonify(frontend_config)
    return JsonResponse(data, safe=False)


def map_view(request):
    # Conectar a MongoDB y obtener datos
    db = get_mongo_connection()
    collection = db['centros_salud']  # Ejemplo: colección de centros de arte
    data = collection.find({})  # Ajusta tu consulta según los filtros

    # Crear un mapa con Folium
    mapa = folium.Map(location=[39.46975, -0.37739], zoom_start=12)  # Coordenadas de Valencia

    # Agregar puntos al mapa
    for item in data:
        # Asegúrate de que tus datos GeoJSON tengan la estructura correcta
        if 'geometry' in item:
            geojson = json.dumps(item['geometry'])
            folium.GeoJson(geojson).add_to(mapa)

    # Renderizar el mapa a HTML
    mapa_html = mapa._repr_html_()

    return render(request, 'map_template.html', {'mapa': mapa_html})

# Crear una función auxiliar para manejar ObjectId
def jsonify(data):
    for document in data:
        if '_id' in document:
            # Convierte ObjectId a str
            document['_id'] = str(document['_id'])
    return data

def get_geojson_data(request):
    db = get_mongo_connection()
    collection = db['centros_salud']  # Ejemplo: colección de centros de arte
    data = collection.find({})  # Ajusta tu consulta según los filtros

    data_list = list(data)
    data_list = jsonify(data_list)
    return JsonResponse(data_list, safe=False) # safe=False para objetos serializables

def get_barrios(request):
    db = get_mongo_connection()
    collection = db['barrios']
    data = collection.find({})
    data_list = list(data)
    data_list = jsonify(data_list)

    # Convierte la lista en una respuesta JSON
    return JsonResponse(data_list, safe=False)


def get_distritos(request):
    db = get_mongo_connection()
    collection = db['distritos']
    data = collection.find({})
    data_list = list(data)
    data_list = jsonify(data_list)

    # Convierte la lista en una respuesta JSON
    return JsonResponse(data_list, safe=False)


def get_secciones(request):
    db = get_mongo_connection()
    collection = db['secciones']
    data = collection.find({})
    data_list = list(data)
    data_list = jsonify(data_list)

    # Convierte la lista en una respuesta JSON
    return JsonResponse(data_list, safe=False)

def get_parcelas(request):
    db = get_mongo_connection()
    collection = db['parcelas']

    
    north = float(request.GET.get('north'))
    south = float(request.GET.get('south'))
    east = float(request.GET.get('east'))
    west = float(request.GET.get('west'))
    print(north, south, east, west)
    # Preparar la consulta geoespacial
    query = {
        'geometry': {
            '$geoWithin': {
                '$geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [west, south], [east, south],
                        [east, north], [west, north],
                        [west, south]  
                    ]]
                }
            }
        }
    }

   
    data = collection.find(query)
    data_list = list(data)

   
    from bson import json_util
    data_json = json_util.dumps(data_list)

    # Devolver la respuesta JSON
    return JsonResponse(data_json, safe=False, json_dumps_params={'indent': 2})



class ConfigView(View):
    def get(self, request):
        black_list = ['_id', 'collection']
        frontend_config = {key: {k: v for k, v in value.items() if k not in black_list} for key, value in config.items()}
        return JsonResponse(frontend_config)

class PolygonsView(View):
    def get(self, request, type_code):
        polygon = config['polygons'].get(type_code)
        if polygon is None:
            return JsonResponse({"error": "Invalid polygon type"}, status=400)
        
        collection_name = polygon['collection']

        if collection_name:
            collection = db[collection_name]
            bounds = request.GET.get('bounds')
            polygons = get_geospatial_data(collection_name, bounds)
            if config['polygons'][type_code].get('lazyLoading'):
                # Si hay LazyLoading, significa que hay index2dsphere, por lo que mongo no devuelve los datos en un geojson con sus features y demás
                # sino que devuelve una lista de diccionarios con los datos de los polígonos
               polygons = build_geojson_from_features(polygons)
            return JsonResponse(polygons, safe=False)
        else:
            return JsonResponse({"error": "Invalid polygon type"}, status=400)

class PointsView(View):
    def get(self, request, type_code):
        points = config['points'].get(type_code)
        if points is None:
            return JsonResponse({"error": "Invalid point type"}, status=400)
        collection_name = points['collection']
        
        if collection_name:
            collection = db[collection_name]
            bounds = request.GET.get('bounds')
            points = get_geospatial_data(collection_name, bounds)
            return JsonResponse(points, safe=False)
        else:
            return JsonResponse({"error": "Invalid point type"}, status=400)
