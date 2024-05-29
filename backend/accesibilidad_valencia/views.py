from django.shortcuts import render
from .mongo import get_mongo_connection

# Create your views here.


from django.shortcuts import render
from django.http import JsonResponse
from .mongo import get_mongo_connection
import json

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
