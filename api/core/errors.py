class ApiError(Exception):
    """Raised by endpoints; rendered as {"error": {"code": ..., "message": ...}}."""

    def __init__(self, code: str, message: str, status: int = 400):
        self.code = code
        self.message = message
        self.status = status
        super().__init__(message)
