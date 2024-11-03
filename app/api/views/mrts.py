from typing import Optional
from fastapi.responses import JSONResponse
from ..utils.render_response import render_response


# GET
def format_mrt_stations_response(
    status: Optional[str] = None, data: Optional[dict] = None
) -> JSONResponse:
    if status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    else:
        return render_response(200, {"data": data})
