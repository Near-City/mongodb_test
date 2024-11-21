from django.shortcuts import render
from .mongo import get_mongo_connection, get_geospatial_data, get_indicadores_accesibilidad, get_isocronas, get_carril_bici, search
from .utils import build_geojson_from_features
# Create your views here.


from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .mongo import get_mongo_connection
import json
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

# Carga del archivo de configuración
with open('accesibilidad_valencia/data/config.json', encoding='utf-8') as f:
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
            red = body.get('red')
            print(area, area_ids, resource, extra, time, user, red)
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
            if red == "null":
                red = None

            # Verificar que todos los parámetros necesarios están presentes
            if not user or not area or not resource or not extra or not time or not red:
                return HttpResponseBadRequest("Todos los parámetros (area, resource, extra, time, user, red) son obligatorios.")

            # Obtener la colección adecuada según el área
            """
            esto es para que el usuario no tenga que elegir directamente el área, sino que se elija automáticamente
            con el área que está seleccionada en el frontend con el nivel de zoom.
            """
            area_collection = (config['polygons'].get(area) or config['defaults']['polygon'])['collection']

            # Obtener los indicadores de accesibilidad
            indicators = get_indicadores_accesibilidad(area_collection, area_ids, resource, extra, time, user, red)

            return JsonResponse(indicators, safe=False)
        
        except json.JSONDecodeError:
            return HttpResponseBadRequest("El cuerpo de la solicitud debe ser JSON válido.")


class IsocronasView(View):
    def post(self, request):
        try:
            # Parsear el cuerpo JSON de la solicitud
            body = json.loads(request.body)
            
            area_id = body.get('area_id')
            time = body.get('time')
            user = body.get('user')
            red = body.get('red')
            
            if area_id == "null":
                area_id = None
            if time == "null":
                time = None
            if user == "null":
                user = None
            if red == "null":
                red = None

            # Verificar que todos los parámetros necesarios están presentes
            if not area_id or not user or not time or not red:
                return HttpResponseBadRequest("Todos los parámetros (area_id, time, user, red) son obligatorios.")

            # Obtener las isocronas
            isocronas = get_isocronas(area_id, time, user, red)

            return JsonResponse(isocronas, safe=False)
        
        except json.JSONDecodeError:
            return HttpResponseBadRequest("El cuerpo de la solicitud debe ser JSON válido.")

class CarrilBiciView(View):
    def get(self, request):
        carril_bici = get_carril_bici()
        return JsonResponse(carril_bici, safe=False) 
    
class SearchView(View):
    def get(self, request):
        query = request.GET.get('query')
        search_results = search(query)
        return JsonResponse(search_results, safe=False)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFTokenView(View):
    def get(self, request):
        return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE')})
