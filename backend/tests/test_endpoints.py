import pytest
from unittest.mock import MagicMock
from src.app.app import new_app
from flask import json

@pytest.fixture
def client():
    mock_ctx = MagicMock()
    app = new_app(mock_ctx)
    app.testing = True
    app.mock_ctx = mock_ctx

    return app.test_client()


def test_filter_with_all_params(client):
    fake_result = [{'id': 1, 'label': 'KNU'}]

    client.application.mock_ctx.institution_usecase.search.return_value = fake_result

    response = client.get('/institutions?search=KNU&city=Kyiv,Lviv&type=University')

    assert response.status_code == 200
    assert response.json == {"institutions": fake_result}
    client.application.mock_ctx.institution_usecase.search.assert_called_with(
        search_text="KNU",
        cities=["Kyiv", "Lviv"],
        inst_type=["University"]
    )


def test_filter_with_no_params(client):
    client.application.mock_ctx.institution_usecase.search.return_value = []

    response = client.get('/institutions')
    assert response.status_code == 200
    client.application.mock_ctx.institution_usecase.search.assert_called_with(
        search_text=None,
        cities=None,
        inst_type=None
    )




