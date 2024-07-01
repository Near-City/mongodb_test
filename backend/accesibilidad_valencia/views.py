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
    def post(self, request):
        try:
            # Parsear el cuerpo JSON de la solicitud
            body = json.loads(request.body)
            area = body.get('area')
            area_ids = body.get('area_ids')  # Obtener lista de 'area_ids' del cuerpo de la solicitud
            resource = body.get('resource')
            extra = body.get('extra')
            time = body.get('time')
            user = body.get('user')

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

            # Verificar que todos los parámetros necesarios están presentes
            if not area or not area_ids or not resource or not extra or not time:
                return HttpResponseBadRequest("Todos los parámetros (area, area_ids, resource, extra, time, user) son obligatorios.")

            # Obtener la colección adecuada según el área
            area_collection = (config['polygons'].get(area) or config['defaults']['polygon'])['collection']

            # Obtener los indicadores de accesibilidad
            indicators = get_indicadores_accesibilidad(area_collection, area_ids, resource, extra, time, user)

            return JsonResponse(indicators, safe=False)
        
        except json.JSONDecodeError:
            return HttpResponseBadRequest("El cuerpo de la solicitud debe ser JSON válido.")


