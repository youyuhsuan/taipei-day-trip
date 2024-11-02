from typing import Optional
from fastapi.responses import JSONResponse
from models.schemas import Attraction
from utils.render_response import render_response


def transform_attraction(attraction):
    img_url = attraction.imgs.split(",") if attraction.imgs else []
    return {
        "id": attraction.id,
        "name": attraction.name,
        "category": attraction.category,
        "description": attraction.description,
        "address": attraction.address,
        "transport": attraction.transport,
        "mrt": attraction.mrt,
        "lat": attraction.lat,
        "lng": attraction.lng,
        "images": img_url,
    }


# Response
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
    status: Optional[str] = None, attraction: Optional[Attraction] = None
) -> JSONResponse:
    if status == "not_found":
        return render_response(400, {"error": True, "message": "No attractions found"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    return render_response(200, {"data": attraction})
