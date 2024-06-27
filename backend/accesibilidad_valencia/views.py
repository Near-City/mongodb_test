from django.shortcuts import render
from .mongo import get_mongo_connection, get_geospatial_data, get_indicadores_accesibilidad
from .utils import build_geojson_from_features
# Create your views here.


from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .mongo import get_mongo_connection
import json
from django.views import View

# Carga del archivo de configuración
with open('accesibilidad_valencia/data/config.json') as f:
    config = json.load(f)

db = get_mongo_connection()

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
            bounds = request.GET.get('bounds')
            polygons = get_geospatial_data(collection_name, bounds)
            # if config['polygons'][type_code].get('lazyLoading'):
            # Si hay LazyLoading, significa que hay index2dsphere, por lo que mongo no devuelve los datos en un geojson con sus features y demás
            # sino que devuelve una lista de diccionarios con los datos de los polígonos

            ## UPDATE: Lo hacemos siempre porque de momento todos los polígonos están por separado y no el GeoJSON entero.
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

class IndicatorsView(View):
    def get(self, request):
        # Sacar los parámetros de la URL
        area = request.GET.get('area')
        resource = request.GET.get('resource')
        extra = request.GET.get('extra')
        time = request.GET.get('time')
        user = request.GET.get('user')

         # Convertir "null" a None
        if area == "null":
            area = None
        if resource == "null":
            resource = None
        if extra == "null":
            extra = None
        if time == "null":
            time = None
        if user == "null":
            user = None
        # FALTA COMPROBAR USER
        # Verificar que todos los parámetros están presentes
        if not area or not resource or not extra or not time:
            return HttpResponseBadRequest("Todos los parámetros (area, resource, extra, time, user) son obligatorios.")

        # Obtener los indicadores de accesibilidad
        indicators = get_indicadores_accesibilidad(area, resource, extra, time, user)
        
        return JsonResponse(indicators, safe=False)
