from unidecode import unidecode
from collections import defaultdict

def build_geojson_from_features(features):
    return {
        "type": "FeatureCollection",
        "features": features
    }

def format_resultados_parcelas(tipo, nombre, parcelas):
    return {
        "type": tipo,
        "name": nombre,
        "parcelas": parcelas
    }

def format_resultados_barrios(id, nombre):
    return {
        "type": "barrio",
        "id": id,
        "name": nombre.capitalize()
    }

def format_resultados_distritos(id, nombre):
    return {
        "type": "distrito",
        "id": id,
        "name": nombre.capitalize()
    }


import re

def extraer_primer_numero(texto):
    # Buscar todos los números en el texto
    numeros = re.findall(r'\d+', texto)
    # Devolver el último número encontrado, si existe
    return int(numeros[0]) if numeros else None

def normalizar_y_extraer_numero(texto, stopwords = None):
    # Normalizar la calle (usando la función anterior)
    texto_normalizado = normalizar_calle(texto, stopwords=stopwords)
    # Extraer el último número
    numero = extraer_primer_numero(texto)
    # Eliminar el número del texto normalizado
    texto_sin_numero = re.sub(r'\d+', '', texto_normalizado).strip()
    return texto_sin_numero, numero

def normalizar_calle(calle, stopwords=None):
    # Convertir a minúsculas y eliminar acentos
    calle = unidecode(calle.lower())
    # Tokenizar y eliminar palabras redundantes
    palabras = [palabra for palabra in calle.split() if palabra not in stopwords]
    # Reconstruir la calle normalizada
    return " ".join(palabras)

def serialize_object_id(obj):
    obj["_id"] = None
    del obj["_id"]
    return obj

def serialize_object_ids(objs):
    return [serialize_object_id(obj) for obj in objs]


matching = {
    "av del": "avenida",
    "br": "barrio",
    "cl": "calle",
    "cm": "camino",
    "cr": "carretera",
    "ds": "diseminado",
    "ed": "edificio",
    "en": "entrada",
    "gr": "grupo",
    "gv": "gran via",
    "lg": "lugar",
    "pd": "paraje",
    "pj": "pasaje",
    "pl": "plaza",
    "pz": "plaza",
    "proc": "procedimiento",
    "ps": "paseo",
    "sd": "subida",
    "tr": "travesia",
    "ur": "urbanizacion"
}


def prettify_street_name(name):
    splits = name.split()
    if len(splits) > 1:
        prefix = splits[0].lower().strip()
        if prefix in matching:
            splits[0] = matching[prefix]
            print(matching[prefix])

    return " ".join([part.capitalize() for part in splits])