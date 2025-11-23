import requests


class Wikidata:
    def __init__(self, host_url: str):
        self.host_url = host_url

    def exec(self, query: str = None):
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
    return Wikidata(host_url)
