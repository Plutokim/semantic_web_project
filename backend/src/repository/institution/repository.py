from core.institution import build_institution
from datasource.fuseki.source import Fuseki


class InstitutionRepository:
    def __init__(self, client: Fuseki, ds_name: str, graph_uri: str):
        self.client = client
        self.ds_name = ds_name
        self.graph_uri = graph_uri

    def insert(self, data: str):
        try:
            self.client.upload_ttl(self.ds_name, data, self.graph_uri)
        except Exception as e:
            raise Exception(
                f"Error inserting educational institution data: {str(e)}")

    def find_by_filter(self, search_text: str = None, cities: list = None, inst_type: list = None):
        filters = []

        if search_text:
            filters.append(f'FILTER(CONTAINS(LCASE(?itemLabel_), LCASE("{search_text}")))')

        if cities:
            filters.append(f'VALUES ?location { {" ".join([f"wd: {c}" for c in cities])} }')

        if inst_type:
            filters.append(f'VALUES ?type { {" ".join([f"wd: {i}" for i in inst_type])} }')

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
            formatted_results = [build_institution(
                keys, result) for result in results]
            return formatted_results
        except Exception as e:
            raise Exception(f"Error finding all institutions: {str(e)}")


def new_institution_repository(client: Fuseki, ds_name: str = "institutions", graph_uri: str = "default"):
    return InstitutionRepository(client, ds_name, graph_uri)
