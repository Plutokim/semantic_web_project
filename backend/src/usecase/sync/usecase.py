from repository.institution.repository import InstitutionRepository
from repository.universal.repository import UniversalRepository
from utils.logger.logger import logger


class SyncUseCase:
    """Сценарій роботи синхронізації даних"""

    def __init__(self, source_repository: UniversalRepository, destination_repository: InstitutionRepository):
        self.source_repository = source_repository
        self.destination_repository = destination_repository

    def start(self):
        """Завантаження даних з Wikidata в Fuseki"""

        logger.info("Starting data synchronization...")
        try:
            ttl_data = self.source_repository.find_institutions()
            self.destination_repository.insert(ttl_data)
            logger.info("Data synchronization completed successfully.")
        except Exception as e:
            logger.error(f"Data synchronization failed: {str(e)}")


def new_sync_usecase(source_repository: UniversalRepository, destination_repository: InstitutionRepository):
    """Фабрична функція"""

    return SyncUseCase(source_repository, destination_repository)