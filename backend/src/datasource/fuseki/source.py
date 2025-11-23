import requests
from requests.auth import HTTPBasicAuth


class Fuseki:
    def __init__(self, host_url: str, user: str, password: str):
        self.user = user
        self.host_url = host_url
        self.auth = HTTPBasicAuth(user, password)

    def list_datasets(self):
        resp = requests.get(
            f"{self.host_url}/$/datasets",
            auth=self.auth,
            timeout=60
        )

        if resp.status_code != 200:
            raise Exception(
                f"Failed to list datasets from Fuseki: {resp.status_code} {resp.text}")

        return resp.json().get("datasets", [])

    def create_dataset(self, ds_name: str, ds_type: str = "mem"):
        resp = requests.post(
            f"{self.host_url}/$/datasets",
            data={"dbName": ds_name, "dbType": ds_type},
            auth=self.auth,
            timeout=60
        )

        if resp.status_code != 200:
            raise Exception(
                f"Failed to create dataset in Fuseki: {resp.status_code} {resp.text}")

    def upload_ttl(self, ds_name: str, data: str, graph_uri: str = "default"):
        resp = requests.put(
            f"{self.host_url}/{ds_name}/data?graph={graph_uri}",
            data=data.encode("utf-8"),
            headers={"Content-Type": "text/turtle"},
            auth=self.auth,
            timeout=120
        )

        if resp.status_code >= 400:
            raise Exception(
                f"Failed to upload data to Fuseki: {resp.status_code} {resp.text}")

    def exec(self, ds_name: str, query: str):
        resp = requests.post(
            f"{self.host_url}/{ds_name}/sparql",
            data={"query": query},
            headers={"Accept": "application/sparql-results+json"},
            auth=self.auth,
            timeout=120
        )

        if resp.status_code != 200:
            raise Exception(
                f"Failed to execute query on Fuseki client: {resp.status_code} {resp.text}")

        return resp.json()


def new_fuseki(host_url: str, user: str, password: str):
    return Fuseki(host_url, user, password)
