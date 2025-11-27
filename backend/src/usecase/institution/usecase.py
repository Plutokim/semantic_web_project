from typing import Literal

from repository.institution.repository import InstitutionRepository
from utils.logger.logger import logger


class InstitutionUseCase:
    def __init__(self, institution_repository: InstitutionRepository):
        self.institution_repository = institution_repository

    def get_all(self):
        return self.search()

    def search(self, item_id: str = None, search_text: str = None, cities: list = None, inst_type: list = None):
        try:
            institutions = self.institution_repository.find_by_filter(item_id, search_text, cities, inst_type)
            return institutions
        except Exception as e:
            logger.error(f"Error getting all institutions: {str(e)}")
            return []

    def get_filters(self, entity: Literal['location', 'type']):
        try:
            filters = self.institution_repository.get_filters_data(entity)
            return filters
        except Exception as e:
            logger.error(f"Error getting filters: {str(e)}")
            return []

def new_institution_usecase(institution_repository: InstitutionRepository):
    return InstitutionUseCase(institution_repository)
