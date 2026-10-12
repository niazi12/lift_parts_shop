import pytest
from django.test import override_settings

from core.models import Product

pytestmark = pytest.mark.django_db


def test_health_is_public_and_checks_database(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_request_id_is_echoed(client):
    response = client.get("/api/v1/health", HTTP_X_REQUEST_ID="abc-123")
    assert response["X-Request-Id"] == "abc-123"


def test_bad_request_id_is_replaced(client):
    response = client.get("/api/v1/health", HTTP_X_REQUEST_ID="<script>")
    assert response["X-Request-Id"] != "<script>"
    assert len(response["X-Request-Id"]) == 32


@override_settings(INTERNAL_API_KEY="right-key")
def test_api_key_auth():
    from core.auth import InternalApiKey

    auth = InternalApiKey()
    assert auth.authenticate(None, "right-key") == "nextjs"
    assert auth.authenticate(None, "wrong-key") is None
    assert auth.authenticate(None, "") is None


def test_admin_is_not_on_default_path(client):
    assert client.get("/admin/").status_code == 404


@override_settings(INTERNAL_API_KEY="right-key")
def test_products_are_listed(client):
    Product.objects.create(
        sku="HS-1001",
        name="Hydraulic Oil Seal",
        slug="hydraulic-oil-seal",
        description="Heavy-duty seal for hydraulic ram assemblies.",
        price="42.50",
        stock_quantity=8,
    )

    response = client.get("/api/v1/products", HTTP_X_API_KEY="right-key")

    assert response.status_code == 200
    payload = response.json()
    assert payload["items"][0]["sku"] == "HS-1001"
    assert payload["items"][0]["name"] == "Hydraulic Oil Seal"
