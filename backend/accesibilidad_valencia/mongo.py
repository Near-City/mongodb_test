from pymongo import MongoClient

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
