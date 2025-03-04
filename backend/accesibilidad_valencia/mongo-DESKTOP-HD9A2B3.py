from pymongo import MongoClient
from unidecode import unidecode
from Levenshtein import distance

db = None

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
        'properties.time': time,
        'properties.user': user,
        'properties.red': red
    }
    
    result = collection.find_one(query)
    
    return {
        "isocrona": result['geometry'],
        "locs": locs_in_isocrona(result['geometry'], 'loc7')
        }

def locs_in_isocrona(isocrona_geometry, collection_name):
    global db
    collection = db[collection_name]
    
    query = {
        'geometry': {
            '$geoWithin': {
                '$geometry': isocrona_geometry
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


def search(termino):
    search = unidecode(termino.lower())
    barrios = db["barrios"]
    
    # regex
    resultados = list(barrios.find({
        "properties.nombre_normalizado": {"$regex": f".*{search}.*", "$options": "i"}
    }))

    if not resultados:
    # si no hay resultados, buscar con distancia de Levenshtein
        todos = list(barrios.find())
        resultados = [
            barrio for barrio in todos
            if distance(search, barrio["properties"]["nombre_normalizado"]) <= 2
        ]
    
    #sino da error al serializar el _id
    for resultado in resultados:
        if "_id" in resultado:
            resultado["_id"] = str(resultado["_id"])
    
    return resultados

