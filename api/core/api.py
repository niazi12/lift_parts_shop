import logging

from django.db import connection
from ninja import NinjaAPI, Router, Schema
from ninja.errors import AuthenticationError, HttpError, ValidationError

from .auth import InternalApiKey
from .errors import ApiError

logger = logging.getLogger(__name__)

api = NinjaAPI(
    title="Lift Parts Shop API",
    version="1.0.0",
    urls_namespace="api_v1",
    auth=InternalApiKey(),
    docs_url="/docs",
)


def error_response(request, code, message, status):
    return api.create_response(request, {"error": {"code": code, "message": message}}, status=status)


@api.exception_handler(ApiError)
def handle_api_error(request, exc):
    return error_response(request, exc.code, exc.message, exc.status)


@api.exception_handler(AuthenticationError)
def handle_auth_error(request, exc):
    return error_response(request, "unauthorised", "Missing or invalid API key", 401)


@api.exception_handler(ValidationError)
def handle_validation_error(request, exc):
    return api.create_response(
        request,
        {"error": {"code": "invalid_request", "message": "Request validation failed", "details": exc.errors}},
        status=422,
    )


@api.exception_handler(HttpError)
def handle_http_error(request, exc):
    return error_response(request, "http_error", str(exc), exc.status_code)


@api.exception_handler(Exception)
def handle_unexpected(request, exc):
    logger.exception("Unhandled API error")
    return error_response(request, "server_error", "Something went wrong", 500)


class HealthOut(Schema):
    status: str
    database: str


health_router = Router(auth=None, tags=["health"])


@health_router.get("/health", response={200: HealthOut, 503: HealthOut})
def health(request):
    """Public uptime check. Confirms the database answers."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return 200, {"status": "ok", "database": "ok"}
    except Exception:
        logger.exception("Health check database failure")
        return 503, {"status": "error", "database": "unavailable"}


api.add_router("", health_router)

# Routers for catalogue, orders and quotes are added in later phases.
