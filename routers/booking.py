from fastapi import APIRouter, Request, Depends
from routers import user
from models.schemas import BookAttraction
from models.JWTAuthenticator import JWTBearer

from views.booking import (
    format_booking_response,
    format_create_booking_response,
    format_delete_booking_response,
)
from controllers.booking import get_booking, post_booking, delete_booking

router = APIRouter()


@router.get(
    "/api/booking",
    tags=["Booking"],
    responses={
        200: {
            "model": format_booking_response,
            "description": "Successfully retrieved booking information",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "attraction": {
                                "id": 1,
                                "name": "台北 101",
                                "address": "台北市信義區信義路五段7號",
                                "image": "https://example.com/taipei101.jpg",
                            },
                            "date": "2024-02-01",
                            "time": "morning",
                            "price": 2000,
                        }
                    }
                }
            },
        },
        403: {
            "model": format_booking_response,
            "description": "Unauthorized access",
            "content": {"application/json": {"example": None}},
        },
        404: {
            "model": format_booking_response,
            "description": "Resource not found",
            "content": {
                "application/json": {
                    "examples": {
                        "booking_not_found": {
                            "summary": "Booking not found",
                            "value": None,
                        },
                        "attraction_not_found": {
                            "summary": "Attraction not found",
                            "value": None,
                        },
                    }
                }
            },
        },
        500: {
            "model": format_booking_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def get_booking_with_attraction(
    request: Request, token: str = Depends(JWTBearer())
):
    return await get_booking(request, token)


@router.post(
    "/api/booking",
    tags=["Booking"],
    responses={
        200: {
            "model": format_create_booking_response,
            "description": "Booking created successfully",
            "content": {"application/json": {"example": {"ok": True}}},
        },
        400: {
            "model": format_create_booking_response,
            "description": "Booking creation failed due to conflict",
            "content": {
                "application/json": {
                    "example": {
                        "error": True,
                        "message": "Attraction already booked on 2024-02-01 at morning",
                    }
                }
            },
        },
        403: {
            "model": format_create_booking_response,
            "description": "Unauthorized access",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Unauthorized access"}
                }
            },
        },
        500: {
            "model": format_create_booking_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def post_booking_with_attraction(
    request: Request, BookAttraction: BookAttraction, token: str = Depends(JWTBearer())
) -> dict:
    return await post_booking(request, BookAttraction, token)


@router.delete(
    "/api/booking",
    tags=["Booking"],
    responses={
        200: {
            "model": format_delete_booking_response,
            "description": "Booking deleted successfully",
            "content": {"application/json": {"example": {"ok": True}}},
        },
        403: {
            "model": format_delete_booking_response,
            "description": "Unauthorized access",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Unauthorized access"}
                }
            },
        },
        500: {
            "model": format_delete_booking_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def delete_booking_with_attraction(
    request: Request, token: str = Depends(JWTBearer())
):
    return await delete_booking(request, token)
