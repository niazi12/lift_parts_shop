import re
import uuid

from .request_context import request_id_var

# Accept the id from Next.js only if it looks sane; otherwise make our own.
_VALID_ID = re.compile(r"^[A-Za-z0-9._-]{1,64}$")


class RequestIdMiddleware:
    """Reads X-Request-Id from Next.js so one checkout can be traced across both apps."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        incoming = request.headers.get("X-Request-Id", "")
        request_id = incoming if _VALID_ID.match(incoming) else uuid.uuid4().hex
        request.request_id = request_id
        # Not reset after the response: Django logs 4xx/5xx after the middleware
        # chain returns, and each new request overwrites the value anyway.
        request_id_var.set(request_id)
        try:
            import sentry_sdk

            sentry_sdk.set_tag("request_id", request_id)
        except ImportError:
            pass
        response = self.get_response(request)
        response["X-Request-Id"] = request_id
        return response
