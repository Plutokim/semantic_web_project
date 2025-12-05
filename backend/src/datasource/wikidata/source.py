import requests


class Wikidata:
    """Клієнт для роботи з Wikidata чекрез HTTP API"""

    def __init__(self, host_url: str):
        self.host_url = host_url

    def exec(self, query: str = None):
        """Виконання SPARQL-запиту"""

        resp = requests.get(
            f"{self.host_url}/sparql",
            params={"query": query},
            headers={"Accept": "text/turtle"},
            timeout=60
        )

        if resp.status_code != 200:
            raise Exception(
                f"Failed to fetch from Wikidata: {resp.status_code}")

        return resp.text


def new_wikidata(host_url: str):
    """Фабрична функція"""

    return Wikidata(host_url)
