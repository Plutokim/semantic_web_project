import pytest

from src.repository.institution.repository import new_institution_repository
from src.datasource.fuseki.source import new_fuseki
from src.config.config import config


@pytest.fixture
def repo():
    """Надає готове джерело даних"""

    client = new_fuseki(config["fuseki_host"], config["fuseki_user"], config["fuseki_password"])
    repo = new_institution_repository(client)
    return repo


def test_data_sanity(repo):
    """Перевірка наявності даних"""

    result = repo.find_by_filter()
    assert len(result) != 0, "DB is empty!"

    locations = repo.get_filters_data('location')
    assert len(locations) != 0, "Locations resultset is empty!"

    types = repo.get_filters_data('type')
    assert len(types) != 0, "Types resultset is empty!"


def test_data_completeness_result(repo):
    """Перевірка повноти даних результату"""

    result = repo.find_by_filter()
    for inst in result:
        name = inst.get('itemLabel')
        assert name and len(name) > 0, f"itemLabel is empty for item {inst.get('item')}."

        location = inst.get('locationLabel')
        assert location and len(location) > 0, f"locationLabel is empty for item {inst.get('item')}."

        type = inst.get('typeLabel')
        assert type and len(type) > 0, f"typeLabel is empty for item {inst.get('item')}."


def test_data_completeness_locations(repo):
    """Перевірка повноти даних фільтру location"""

    result = repo.get_filters_data('location')
    for i, inst in enumerate(result):
        assert inst.get('id'), f"Item #{i} has no ID."

        name = inst.get('label')
        assert name and len(name) > 0, f"Label is empty for item {inst.get('locationId')}."


def test_data_completeness_types(repo):
    """Перевірка повноти даних фільтру type"""

    result = repo.get_filters_data('type')
    for i, inst in enumerate(result):
        assert inst.get('id'), f"Item #{i} has no ID."

        name = inst.get('label')
        assert name and len(name) > 0, f"Label is empty for item {inst.get('locationId')}."
