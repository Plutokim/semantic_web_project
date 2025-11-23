def build_institution(keys, raw_object):
    institution = {}
    for key in keys:
        institution[key] = raw_object.get(key, {}).get('value', None)
    return institution