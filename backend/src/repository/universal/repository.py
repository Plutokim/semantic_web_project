from datasource.wikidata.source import Wikidata


class UniversalRepository:
    """Репоизторій для роботи з даними Wikidata"""

    def __init__(self, client: Wikidata):
        self.client = client

    def find_institutions(self):
        """Отримання всіх закладів освіти"""

        _query = """
                    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
                    PREFIX wd: <http://www.wikidata.org/entity/>
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                    
                    CONSTRUCT {
                      ?item a wd:Q2385804 .
                      ?item wdt:P17 wd:Q212 .
                      ?item wdt:P131 ?location .
                      ?item wdt:P31 ?type .
                      
                      ?item wdt:P571 ?founded .
                      ?item wdt:P856 ?website .
                      ?item wdt:P625 ?coordinate .
                      ?item wdt:P18 ?image .
                      ?item wdt:P2196 ?studentCount .
                      ?item wdt:P6375 ?address .
                      
                      ?item rdfs:label ?itemLabel .
                      ?type rdfs:label ?typeLabel .
                      ?location rdfs:label ?locationLabel .
                    }
                    WHERE {
                      ?item wdt:P31/wdt:P279* wd:Q2385804 ;
                            wdt:P17 wd:Q212 ;
                            wdt:P131 ?location ;
                            wdt:P31 ?type .
                      
                      OPTIONAL { ?item wdt:P571 ?founded . }       
                      OPTIONAL { ?item wdt:P856 ?website . }       
                      OPTIONAL { ?item wdt:P625 ?coordinate . }    
                      OPTIONAL { ?item wdt:P18 ?image . }          
                      OPTIONAL { ?item wdt:P2196 ?studentCount . } 
                      OPTIONAL { ?item wdt:P6375 ?address . }     
                      
                      SERVICE wikibase:label { bd:serviceParam wikibase:language "uk,en" . }
                    }
                    """
        try:
            ttl_data = self.client.exec(_query)
            return ttl_data
        except Exception as e:
            raise Exception(f"Error find all: {str(e)}")


def new_universal_repository(client: Wikidata):
    """Фабрична функція"""

    return UniversalRepository(client)
