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
