import hmac

from django.conf import settings
from ninja.security import APIKeyHeader


class InternalApiKey(APIKeyHeader):
    """Shared secret sent by the Next.js server. The browser never calls Django."""

    param_name = "X-Api-Key"

    def authenticate(self, request, key):
        if key and hmac.compare_digest(key, settings.INTERNAL_API_KEY):
            return "nextjs"
        return None
