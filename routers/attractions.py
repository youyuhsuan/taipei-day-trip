from fastapi import APIRouter, Request, Query, Path
from typing import Annotated, Optional


from controllers.attractions import get_attractions_list

from views.attractions import (
    format_attractions_response,
    format_single_attraction_response,
)

router = APIRouter()


@router.get(
    "/api/attractions",
    tags=["Attractions"],
    responses={
        200: {
            "model": format_attractions_response,
            "description": "Successfully retrieved attractions",
            "content": {
                "application/json": {
                    "example": {
                        "nextPage": 2,
                        "data": [
                            {
                                "id": 1,
                                "name": "台北 101",
                                "category": "景點",
                                "description": "台北101是台北地標性建築...",
                                "address": "台北市信義區信義路五段7號",
                                "transport": "搭乘捷運信義線至台北101/世貿站...",
                                "mrt": "台北101/世貿站",
                                "lat": 25.033976,
                                "lng": 121.564472,
                                "images": [
                                    "https://example.com/taipei101_1.jpg",
                                    "https://example.com/taipei101_2.jpg",
                                ],
                            },
                            {
                                "id": 2,
                                "name": "國立故宮博物院",
                                "category": "博物館",
                                "description": "國立故宮博物院是世界級博物館...",
                                "address": "台北市士林區至善路二段221號",
                                "transport": "搭乘捷運淡水線至士林站...",
                                "mrt": "士林站",
                                "lat": 25.1024,
                                "lng": 121.5485,
                                "images": [
                                    "https://example.com/museum_1.jpg",
                                    "https://example.com/museum_2.jpg",
                                ],
                            },
                        ],
                    }
                }
            },
        },
        403: {
            "model": format_attractions_response,
            "description": "Unauthorized access",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Unauthorized access"}
                }
            },
        },
        500: {
            "model": format_attractions_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def attractions_list(
    request: Request,
    page: Annotated[int, Query(description="Page number, 12 items per page", ge=0)] = 0,
    keyword: Annotated[
        Optional[str],
        Query(
            description="Keyword for exact MRT station match or partial attraction name match"
        ),
    ] = "",
):
    return await get_attractions_list(request, page, keyword)


@router.get(
    "/api/attraction/{attractionId}",
    tags=["Attractions"],
    responses={
        200: {
            "model": format_single_attraction_response,
            "description": "Successfully retrieved attraction details",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "id": 1,
                            "name": "台北 101",
                            "category": "景點",
                            "description": "台北101是台北地標性建築，是台灣最高的摩天大樓，共有101層。觀景台位於89樓，可以俯瞰整個台北市景色。每年跨年煙火更是台北市的重要活動之一。",
                            "address": "台北市信義區信義路五段7號",
                            "transport": "搭乘捷運信義線至台北101/世貿站1號出口，步行約5分鐘即可抵達。",
                            "mrt": "台北101/世貿站",
                            "lat": 25.033976,
                            "lng": 121.564472,
                            "images": [
                                "https://example.com/taipei101_1.jpg",
                                "https://example.com/taipei101_2.jpg",
                                "https://example.com/taipei101_3.jpg",
                            ],
                        }
                    }
                }
            },
        },
        400: {
            "model": format_single_attraction_response,
            "description": "Attraction not found",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "No attractions found"}
                }
            },
        },
        500: {
            "model": format_single_attraction_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def get_single_attraction(
    request: Request,
    attractionId: Annotated[int, Path(description="景點編號")],
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "select * from attractions where attractions.id = %s;"
                cursor.execute(query, (attractionId,))
                data = cursor.fetchone()
                query = (
                    "SELECT images FROM attractions_images WHERE attractions_id = %s;"
                )
                cursor.execute(query, (attractionId,))
                image_data = cursor.fetchall()
                if data:
                    img_urls = [img["images"] for img in image_data]
                    data["images"] = img_urls
                    return format_single_attraction_response(data=data)
                else:
                    return format_single_attraction_response(status="not_found")
    except Exception as e:
        print(
            f"Error getting single attraction, attraction ID {attractionId}: {str(e)}"
        )
        return format_single_attraction_response(status="server_error")
