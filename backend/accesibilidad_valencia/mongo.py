from pymongo import MongoClient

db = None

def get_mongo_connection():
    global db
    client = MongoClient('mongodb://localhost:27017')
    db = client['nearcitydb']
    return db

def get_geospatial_data(collection_name, bounds = None):
    global db
    if bounds is None:
        data = list(db[collection_name].find({}, {'_id': 0}))
        return data
    
    north, south, east, west = map(float, bounds.split(','))
    collection = db[collection_name]
    data = list(collection.find({
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
    }, {'_id': 0}))
    return data

def get_indicadores_accesibilidad(area=None, area_ids=None, resource=None, extra=None, time=None, user=None):
    global db
    collection_name = "indicadores_accesibilidad"
    collection = db[collection_name]
    query = {}
    
    if area is not None:
        query['area'] = area
    if area_ids:
        query['area_id'] = {'$in': area_ids}  # Usar operador '$in' para filtrar por lista de 'area_id'
    if resource is not None:
        query['resource'] = resource
    if extra is not None:
        query['extra'] = extra
    if time is not None:
        query['time'] = int(time)
    
    result = collection.find(query)
    
    return {r['area_id']: r['value'] for r in result}
