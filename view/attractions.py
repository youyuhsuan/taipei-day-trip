from typing import Optional
from fastapi.responses import JSONResponse
from model.schemas import Attraction
from utils.render_response import render_response


# GET
def format_attractions_response(
    status: Optional[str] = None,
    nextpage: Optional[int] = None,
    attractions: Optional[Attraction] = None,
) -> JSONResponse:
    if status == "unauthorized":
        return render_response(403, {"error": True, "message": "Unauthorized access"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    return render_response(200, {"nextPage": nextpage, "data": attractions})


# GET
def format_single_attraction_response(
    status: Optional[str] = None, data: Optional[Attraction] = None
) -> JSONResponse:
    if status == "not_found":
        return render_response(400, {"error": True, "message": "No attractions found"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    return render_response(200, {"data": data})
