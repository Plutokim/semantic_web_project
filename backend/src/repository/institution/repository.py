from typing import Literal

from utils.sparql.parser import parse_sparql_binding
from datasource.fuseki.source import Fuseki


class InstitutionRepository:
    """Репоизторій для роботи з даними про навчальні заклади"""

    def __init__(self, client: Fuseki, ds_name: str, graph_uri: str):
        self.client = client
        self.ds_name = ds_name
        self.graph_uri = graph_uri

    def insert(self, data: str):
        """Завантаження даних в Fuseki"""

        try:
            self.client.upload_ttl(self.ds_name, data, self.graph_uri)
        except Exception as e:
            raise Exception(
                f"Error inserting educational institution data: {str(e)}")

    def find_by_filter(self, item_id: str = None, search_text: str = None, cities: list = None, inst_type: list = None):
        """Конструктор SPARQL запиту фільтрації"""

        filters = []

        if search_text:
            filters.append(f'FILTER(CONTAINS(LCASE(?itemLabel_), LCASE("{search_text}")))')

        if cities:
            filters.append(f'VALUES ?location {{ {" ".join([f"wd:{c}" for c in cities])} }}')

        if inst_type:
            filters.append(f'VALUES ?type {{ {" ".join([f"wd:{i}" for i in inst_type])} }}')

        if item_id:
            filters.append(f'FILTER(?item = wd:{item_id})')

        _query = f"""
                        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                        PREFIX wd: <http://www.wikidata.org/entity/>

                        SELECT ?item
                               (SAMPLE(?itemLabel_) AS ?itemLabel)
                               (SAMPLE(?typeLabel_) AS ?typeLabel)
                               (SAMPLE(?locationLabel_) AS ?locationLabel)
                               (SAMPLE(?founded_) AS ?founded)
                               (SAMPLE(?website_) AS ?website)
                               (SAMPLE(?coordinate_) AS ?coordinate)
                               (SAMPLE(?image_) AS ?image)
                               (SAMPLE(?studentCount_) AS ?studentCount)
                               (SAMPLE(?address_) AS ?address)
                        WHERE {{
                          ?item a wd:Q2385804 ;
                                wdt:P17 wd:Q212 ;
                                wdt:P131 ?location ;
                                wdt:P31 ?type .

                          OPTIONAL {{ ?item wdt:P571 ?founded_ . }}
                          OPTIONAL {{ ?item wdt:P856 ?website_ . }}
                          OPTIONAL {{ ?item wdt:P625 ?coordinate_ . }}
                          OPTIONAL {{ ?item wdt:P18 ?image_ . }}
                          OPTIONAL {{ ?item wdt:P2196 ?studentCount_ . }}
                          OPTIONAL {{ ?item wdt:P6375 ?address_ . }}

                          OPTIONAL {{ ?item rdfs:label ?itemLabel_ . }}
                          OPTIONAL {{ ?type rdfs:label ?typeLabel_ . }}
                          OPTIONAL {{ ?location rdfs:label ?locationLabel_ . }}
                          
                          {" ".join(filters)}
                          
                          FILTER(!STRSTARTS(?itemLabel_, "Q"))
                        }}
                        GROUP BY ?item
            """
        try:
            resp = self.client.exec(self.ds_name, _query)
            keys = resp.get("head", {}).get("vars", [])
            results = resp.get("results", {}).get("bindings", [])
            formatted_results = [parse_sparql_binding(
                keys, result) for result in results]
            return formatted_results
        except Exception as e:
            raise Exception(f"Error finding institutions: {str(e)}")

    def get_filters_data(self, entity: Literal['location', 'type']):
        """Конструктор SPARQL запиту для виведення списку значень фільтрів"""

        _query = f"""
                        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                        PREFIX wd: <http://www.wikidata.org/entity/>
        
                        SELECT 
                            DISTINCT 
                            (STRAFTER(STR(?{entity}), "entity/") AS ?id)
                            ?label
                        WHERE {{
                          ?item a wd:Q2385804 ;
                                wdt:P17 wd:Q212 ;
                                wdt:P131 ?location ;
                                wdt:P31 ?type .
           
                        ?{entity} rdfs:label ?label . 
                        
                        FILTER(LANG(?label) = "uk")
                }}
        """
        try:
            resp = self.client.exec(self.ds_name, _query)
            keys = resp.get("head", {}).get("vars", [])
            results = resp.get("results", {}).get("bindings", [])
            formatted_results = [parse_sparql_binding(
                keys, result) for result in results]
            return formatted_results
        except Exception as e:
            raise Exception(f"Error retrieving filters: {str(e)}")

def new_institution_repository(client: Fuseki, ds_name: str = "institutions", graph_uri: str = "default"):
    """Фабрична функція"""

    return InstitutionRepository(client, ds_name, graph_uri)
