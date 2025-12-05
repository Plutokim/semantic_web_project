def parse_sparql_binding(keys, raw_object):
    """Парсинг результату SPARQL запиту"""

    items = {}
    for key in keys:
        items[key] = raw_object.get(key, {}).get('value', None)
    return items