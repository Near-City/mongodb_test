from django.shortcuts import render
from .mongo import get_mongo_connection, get_geospatial_data, get_indicadores_accesibilidad, get_isocronas, get_carril_bici, search, locs_inside_geometry, get_parcelas_by_barrio, get_parcelas_by_distrito
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
        frontend_config = {key: {k: v for k, v in value.items(
        ) if k not in black_list} for key, value in config.items()}
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

            # UPDATE: Lo hacemos siempre porque de momento todos los polígonos están por separado y no el GeoJSON entero.
            polygons = build_geojson_from_features(polygons)
            return JsonResponse(polygons, safe=False)
        else:
            return JsonResponse({"error": "Invalid polygon type"}, status=400)


class LocsView(View):
    def get(self, request, resource_code):
        if resource_code not in config['schema']['options']:
            return JsonResponse({"error": "Invalid loc type"}, status=400)
        if not request.GET.get('bounds'):
            return JsonResponse({"error": "Bounds are required"}, status=400)
        collection_name = resource_code

        bounds_str = request.GET.get('bounds')
        coords = list(map(float, bounds_str.split(',')))


        if len(coords) != 4:
            return JsonResponse({"error": "Invalid bounds format"}, status=400)

        # Si el orden es: north, south, east, west
        north, south, east, west = coords

        polygon = {
            "type": "Polygon",
            "coordinates": [[
                [west, south],  # minX, minY
                [west, north],  # minX, maxY
                [east, north],  # maxX, maxY
                [east, south],  # maxX, minY
                [west, south]   # cerrar el polígono
            ]]
        }

        if collection_name:
                bounds = request.GET.get('bounds')
                locs = locs_inside_geometry(polygon, collection_name)
                return JsonResponse(locs, safe=False)
        else:
            return JsonResponse({"error": "Invalid loc type"}, status=400)


class IndicatorsView(View):
    def post(self, request):
        try:
            # Parsear el cuerpo JSON de la solicitud
            body = json.loads(request.body)
            area = body.get('area')
            # Obtener lista de 'area_ids' del cuerpo de la solicitud
            area_ids = body.get('area_ids')
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
            area_collection = (config['polygons'].get(
                area) or config['defaults']['polygon'])['collection']

            # Obtener los indicadores de accesibilidad
            indicators = get_indicadores_accesibilidad(
                area_collection, area_ids, resource, extra, time, user, red)

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


class FilterPlotsView(View):
    def get(self, request, area_code, area_id):
        if area_code not in config['polygons']:
            return JsonResponse({"error": "Invalid area code"}, status=400)
        if not area_id:
            return JsonResponse({"error": "Area id is required"}, status=400)

        if area_code == 'B':
            parcelas = get_parcelas_by_barrio(area_id)
        elif area_code == 'D':
            parcelas = get_parcelas_by_distrito(area_id)      
        else:
            return JsonResponse({"error": "Invalid area code"}, status=400)
        
        return JsonResponse(parcelas, safe=False)


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
