from typing import Optional, Dict
from fastapi.responses import JSONResponse
from utils.render_response import render_response
from models.schemas import BookAttraction


# GET
def format_booking_response(
    status: Optional[str] = None, data: Optional[BookAttraction] = None
):
    if status == "unauthorized":
        return None
    elif status == "not_found_booking":
        return None
    elif status == "not_found_attraction":
        return None
    elif status == "not_found_attraction":
        return None
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    else:
        return {"data": data}


# POST
def format_create_booking_response(
    status: Optional[str] = None,
    content: Optional[Dict] = None,
) -> JSONResponse:
    if status == "match_book":
        return render_response(400, {"error": True, "message": content})
    elif status == "unauthorized":
        return render_response(403, {"error": True, "message": "Unauthorized access"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    return render_response(200, {"ok": True})


# DELETE
def format_delete_booking_response(
    status: Optional[str] = None,
) -> JSONResponse:
    if status == "unauthorized":
        return render_response(403, {"error": True, "message": "Unauthorized access"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    return render_response(200, {"ok": True})
