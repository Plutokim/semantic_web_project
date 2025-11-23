import os


config = {
    "host": os.getenv("HOST", "0.0.0.0"),
    "port": int(os.getenv("PORT", "5000")),
    "fuseki_host": os.getenv("FUSEKI_HOST", ""),
    "fuseki_user": os.getenv("FUSEKI_USER", ""),
    "fuseki_password": os.getenv("FUSEKI_PASSWORD", ""),
    "wikidata_host": os.getenv("WIKIDATA_HOST", ""),
}
