from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from routers import user
from models.booking import BookAttraction
from models.JWTAuthenticator import JWTBearer, CustomHTTPException
from views.booking import (
    format_booking_response,
    format_create_booking_response,
    format_delete_booking_response,
)

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
    if not token:
        return format_booking_response(status="unauthorized")
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                credentials = user.decodeJWT(token)
                query = "SELECT * FROM booking WHERE user_id = %s"
                cursor.execute(query, (credentials["id"],))
                match_booking = cursor.fetchone()
                if not match_booking:
                    return format_booking_response(status="not_found_booking")
                query = """
                SELECT attractions.id, attractions.name, attractions.address, attractions_images.images AS image
                FROM attractions
                JOIN attractions_images ON attractions.id = attractions_images.attractions_id
                WHERE attractions.id = %s
                LIMIT 1;"""
                cursor.execute(query, (match_booking["attraction_id"],))
                match_attraction = cursor.fetchone()
                if not match_attraction:
                    return format_booking_response(status="not_found_attraction")
                data = {
                    "attraction": {
                        "id": match_attraction["id"],
                        "name": match_attraction["name"],
                        "address": match_attraction["address"],
                        "image": match_attraction["image"],
                    },
                    "date": match_booking["date"],
                    "time": match_booking["time"],
                    "price": match_booking["price"],
                }
                return format_booking_response(data=data)
    except Exception as e:
        print(f"Error in getting booking with attraction: {str(e)}")
        return format_booking_response(status="server_error")


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
async def create_booking(
    request: Request, BookAttraction: BookAttraction, token: str = Depends(JWTBearer())
) -> dict:
    if not token:
        return format_create_booking_response(status="unauthorized")
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT id FROM booking WHERE attraction_id = %s AND date = %s AND time = %s"
                cursor.execute(
                    query,
                    (
                        BookAttraction.attractionId,
                        BookAttraction.date,
                        BookAttraction.time.value,
                    ),
                )
                match_book = cursor.fetchone()
                if match_book:
                    content = {
                        "error": True,
                        "message": f"Attraction already booked on {BookAttraction.date} at {BookAttraction.time}",
                    }
                    return format_create_booking_response(
                        status="match_book", content=content
                    )
                else:
                    credentials = user.decodeJWT(token)
                    insert_new_book = """
                        INSERT INTO booking (attraction_id, user_id, date, time, price) 
                        VALUES (%s, %s, %s, %s, %s)
                        ON DUPLICATE KEY UPDATE
                        attraction_id = VALUES(attraction_id),
                        date = VALUES(date),
                        time = VALUES(time),
                        price = VALUES(price)
                    """
                    cursor.execute(
                        insert_new_book,
                        (
                            BookAttraction.attractionId,
                            credentials["id"],
                            BookAttraction.date,
                            BookAttraction.time.value,
                            BookAttraction.price.value,
                        ),
                    )
                    con.commit()
                    return format_create_booking_response()
    except Exception as e:
        print(f"Error in creating booking: {str(e)}")
        return format_create_booking_response(status="server_error")


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
async def delete_booking(request: Request, token: str = Depends(JWTBearer())):
    if not token:
        return format_delete_booking_response(status="unauthorized")
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                credentials = user.decodeJWT(token)
                delete_query = "DELETE FROM booking WHERE user_id = %s"
                cursor.execute(delete_query, (credentials["id"],))
                con.commit()
                return format_delete_booking_response()
    except Exception as e:
        return format_delete_booking_response(status="server_error")
