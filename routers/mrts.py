from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from views.mrts import format_mrt_stations_response
from controllers.mrts import get_mrt

router = APIRouter()


@router.get(
    "/api/mrts",
    tags=["MRT Station"],
    responses={
        200: {
            "model": format_mrt_stations_response,
            "description": "Successfully retrieved MRT stations",
            "content": {
                "application/json": {
                    "example": {
                        "data": ["台北車站", "中山站", "大安站", "信義安和", "象山"]
                    }
                }
            },
        },
        500: {
            "model": format_mrt_stations_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def get_mrt_with_attractions(
    request: Request,
):
    return await get_mrt(request)
