from datasource.fuseki.source import new_fuseki
from datasource.wikidata.source import new_wikidata
from repository.institution.repository import new_institution_repository
from repository.universal.repository import new_universal_repository
from utils.fuseki.migrator.migrator import new_migrator
from usecase.sync.usecase import new_sync_usecase
from usecase.institution.usecase import new_institution_usecase


class Context:
    def __init__(self, config):
        self.fuseki_client = new_fuseki(config["fuseki_host"], config["fuseki_user"], config["fuseki_password"],
                                        )
        self.wikidata_client = new_wikidata(config["wikidata_host"])
        self.universal_repository = new_universal_repository(
            self.wikidata_client
        )
        self.institution_repository = new_institution_repository(
            self.fuseki_client)

        new_migrator(self.fuseki_client).create_dataset("institutions", "mem")

        self.sync_usecase = new_sync_usecase(
            self.universal_repository,
            self.institution_repository
        )
        self.institution_usecase = new_institution_usecase(
            self.institution_repository
        )


def new_ctx(config):
    return Context(config)
