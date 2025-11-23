from repository.institution.repository import InstitutionRepository
from utils.logger.logger import logger


class InstitutionUseCase:
    def __init__(self, institution_repository: InstitutionRepository):
        self.institution_repository = institution_repository

    def get_all(self):
        try:
            institutions = self.institution_repository.find_all()
            return institutions
        except Exception as e:
            logger.error(f"Error getting all institutions: {str(e)}")
            return []


def new_institution_usecase(institution_repository: InstitutionRepository):
    return InstitutionUseCase(institution_repository)
