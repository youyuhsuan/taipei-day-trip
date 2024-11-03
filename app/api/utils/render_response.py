from fastapi.responses import JSONResponse
from typing import Any


def render_response(status_code: int, content: dict[str, Any]) -> JSONResponse:
    """
    Render a JSON response with consistent format
    """
    return JSONResponse(
        status_code=status_code, content=content, media_type="application/json"
    )
