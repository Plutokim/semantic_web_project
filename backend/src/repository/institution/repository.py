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

    def find_all(self):
        _query = """
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>

SELECT DISTINCT ?itemLabel ?typeLabel ?locationLabel ?founded ?website ?coordinate ?image ?studentCount ?address
WHERE {
  ?item a wd:Q2385804 ;
        wdt:P17 wd:Q212 ;
        wdt:P131 ?location ;
        wdt:P31 ?type .

  OPTIONAL { ?item wdt:P571 ?founded . }
  OPTIONAL { ?item wdt:P856 ?website . }
  OPTIONAL { ?item wdt:P625 ?coordinate . }
  OPTIONAL { ?item wdt:P18 ?image . }
  OPTIONAL { ?item wdt:P2196 ?studentCount . }
  OPTIONAL { ?item wdt:P6375 ?address . }
  
  OPTIONAL { ?item rdfs:label ?itemLabel . }
  OPTIONAL { ?type rdfs:label ?typeLabel . }
  OPTIONAL { ?location rdfs:label ?locationLabel . }
  
  FILTER(!STRSTARTS(?itemLabel, "Q"))
}
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
