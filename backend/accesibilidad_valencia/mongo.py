from pymongo import MongoClient
from unidecode import unidecode
from Levenshtein import distance
from .utils import format_resultados_barrios, format_resultados_parcelas, normalizar_y_extraer_numero, serialize_object_ids, prettify_street_name

db = None
STOPWORDS = [
    "avenida", "av",
    "barrio", "br",
    "calle", "cl",
    "callejon", "cj",
    "camino", "cm",
    "carretera", "cr",
    "diseminado", "ds",
    "edificio", "ed",
    "entrada", "en",
    "grupo", "gr",
    "gran via", "gv",
    "lugar", "lg",
    "paraje", "pd",
    "pasaje", "pj",
    "plaza", "pl", "pz",
    "procedimiento", "proc",
    "paseo", "ps",
    "subida", "sd",
    "travesia", "tr",
    "urbanizacion", "ur",
    "de", "del", "la", "los", "las", "el"  # Palabras comunes de enlace
]


def get_mongo_connection():
    global db
    client = MongoClient('mongodb://localhost:27017')
    db = client['nearcitydb']
    return db

def get_geospatial_data(collection_name, bounds=None):
    global db
    if bounds is None:
        data = list(db[collection_name].find({}, {'_id': 0}))
        return data
    
    north, south, east, west = map(float, bounds.split(','))
    collection = db[collection_name]
    
    # Usamos geoIntersects para incluir también los polígonos que están parcialmente dentro de los límites
    data = list(collection.find({
        'geometry': {
            '$geoIntersects': { # Cambio esto de '$geoWithin' a '$geoIntersects' porque quiero que me devuelva los polígonos que están parcialmente dentro de los límites
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
    }, {'_id': 0}))
    
    return data


def get_indicadores_accesibilidad(area=None, area_ids=None, resource=None, extra=None, time=None, user=None, red = None):
    global db
    # collection_name = "indicadores_accesibilidad"
    collection_name = "updated_indicators"
    collection = db[collection_name]
    query = {}
    
    """
    todo: area_id está cogiendo las ids originales, no las nuevas de las parcelas -> cambiar nationalCa por area_id
    """
    if area is not None:
        query['area'] = area
    if area_ids:
        query['area_id'] = {'$in': area_ids}  # Usar operador '$in' para filtrar por lista de 'area_id'
    if resource is not None:
        query['resource'] = resource
    if extra is not None:
        query['extra'] = extra
    if time is not None:
        query['time'] = str(time)
    if user is not None:
        query['user'] = user
    if red is not None:
        query['red'] = red
    
    print(query)
    result = collection.find(query)
    
    return {str(r['area_id']): r['value'] for r in result}


def get_isocronas(area_id, time, user, red):
    global db
    collection_name = "test"
    collection = db[collection_name]
    
    # Ajustar el query para buscar dentro de "properties"
    query = {
        'properties.area_id': area_id,
        'properties.time': str(time),
        'properties.user': user,
        'properties.red': red
    }
    
    result = collection.find_one(query)
    
    return {
        "isocrona": result['geometry'],
        "locs": locs_inside_geometry(result['geometry'], 'loc7') # CAMBIAR ESTO AL TIPO DE LOC QUE SEA
        }

def locs_inside_geometry(geometry, collection_name):
    global db
    collection = db[collection_name]
    
    query = {
        'geometry': {
            '$geoWithin': {
                '$geometry': geometry
            }
        }
    }
    
    result = collection.find(query, {'_id': 0})
    
    return list(result)

def get_carril_bici():
    global db
    collection_name = "bici"
    collection = db[collection_name]
    data = list(collection.find({}, {'_id': 0}))
    
    return data

def buscar_parcela(parcelas_collection, calle, numero=None):
    if calle is None or calle == "":
        return []
    calle_normalizada, numero = normalizar_y_extraer_numero(calle, stopwords=STOPWORDS)
    resultados = []

    # Construir regex para buscar coincidencias flexibles
    regex_calle = {"$regex": f".*{calle_normalizada}.*", "$options": "i"}

    if numero:
        resultados = parcelas_collection.find({
            "properties.calle_normalizada": regex_calle,
            "properties.numero": numero
        })
        resultados = serialize_object_ids(resultados)
        if resultados:
            # Cogemos calle de referencia
            calle = resultados[0].get("properties", {}).get("direccion")
            calle_pretty = prettify_street_name(calle)
            return [format_resultados_parcelas("parcela", calle_pretty, list(resultados))]
    
    # Si no se proporciona un número o no hay resultados, buscar todas las parcelas en la calle
    resultados = parcelas_collection.find({
        "properties.calle_normalizada": regex_calle
    })
    resultados = serialize_object_ids(resultados)
    if resultados:
        # Agrupar por calles y calcular distancia Levenshtein
        calles_dict = {}
        for parcela in resultados:
            calle = parcela.get("properties", {}).get("calle")
            if not calle:
                continue
            if calle not in calles_dict:
                dist = distance(calle_normalizada, unidecode(calle.lower()))
                calles_dict[calle] = {
                    'parcelas': [],
                    'distancia': dist
                }
            calles_dict[calle]['parcelas'].append(parcela)
        
        # Ordenar por distancia Levenshtein
        calles_ordenadas = sorted(calles_dict.items(), key=lambda x: x[1]['distancia'])
        
        res = []
        for calle, info in calles_ordenadas:
            calle_pretty = prettify_street_name(calle)
            res.append(format_resultados_parcelas("calle", calle_pretty, info['parcelas']))
        return res

    return []



def buscar_barrio(barrios_collection, termino):
    termino_normalizado = unidecode(termino.lower())

    # Búsqueda rápida con regex
    resultados = list(barrios_collection.find({
        "properties.nombre_normalizado": {"$regex": f".*{termino_normalizado}.*", "$options": "i"}
    }))

    if not resultados:
        # Si no hay resultados, buscar con distancia de Levenshtein
        todos = list(barrios_collection.find())
        resultados = [
            barrio for barrio in todos
            if distance(termino_normalizado, barrio["properties"]["nombre_normalizado"]) <= 2
        ]
    
    resultados = serialize_object_ids(resultados)

    return [format_resultados_barrios(barrio.get("properties", {}).get("C_DISTBAR"), barrio.get("properties", {}).get("N_BAR") ) for barrio in resultados]

def search(termino):
    resultados = buscar_parcela(db["parcelas"], termino) + buscar_barrio(db["barrios"], termino)
    
    # #sino da error al serializar el _id
    # for resultado in resultados:
    #     if "_id" in resultado:
    #         resultado["_id"] = str(resultado["_id"])
    
    return resultados

