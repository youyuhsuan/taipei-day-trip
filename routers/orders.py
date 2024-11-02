from fastapi import APIRouter, Query, Request, Depends
from typing import Annotated
import json

from models.JWTAuthenticator import JWTBearer
from models.schemas import OrderCreate
from views.orders import (
    format_create_order_response,
    format_get_order_by_number_response,
)
from controllers.orders import post_create_order

router = APIRouter()


@router.post(
    "/api/orders",
    tags=["Order"],
    responses={
        200: {
            "model": format_create_order_response,
            "description": "Order creation successful",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "order_number": "2024020001",
                            "amount": 2000,
                            "status": "paid",
                        }
                    }
                },
            },
        },
        400: {
            "model": format_create_order_response,
            "description": "Order creation failed",
            "content": {
                "application/json": {
                    "examples": {
                        "booking_not_found": {
                            "summary": "Matching booking not found",
                            "value": {
                                "error": True,
                                "message": "Matching booking not found",
                            },
                        },
                        "payment_failure": {
                            "summary": "Payment processing failed",
                            "value": {
                                "data": {
                                    "error": True,
                                    "message": "Payment processing failed",
                                    "details": {
                                        "status": "failed",
                                        "reason": "Invalid card information",
                                    },
                                }
                            },
                        },
                    }
                }
            },
        },
        403: {
            "model": format_create_order_response,
            "description": "Unauthorized access",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Unauthorized access"}
                }
            },
        },
        500: {
            "model": format_create_order_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def create_order(
    request: Request, OrderCreate: OrderCreate, token: str = Depends(JWTBearer())
) -> dict:
    return await post_create_order(request, OrderCreate, token)


@router.get(
    "/api/orders",
    tags=["Order"],
    responses={
        200: {
            "model": format_get_order_by_number_response,
            "description": "Order found successfully",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "number": "2024020001",
                            "price": 2000,
                            "trip": {
                                "attraction": {
                                    "id": 1,
                                    "name": "台北 101",
                                    "address": "台北市信義區信義路五段7號",
                                    "image": "https://example.com/101.jpg",
                                },
                                "date": "2024-02-01",
                                "time": "morning",
                            },
                            "contact": {
                                "name": "王小明",
                                "email": "test@example.com",
                                "phone": "0912345678",
                            },
                            "status": 0,
                        }
                    }
                }
            },
        },
        400: {
            "model": format_get_order_by_number_response,
            "description": "Order retrieval failed",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Matching booking not found"}
                }
            },
        },
        403: {
            "model": format_get_order_by_number_response,
            "description": "Unauthorized access",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Unauthorized access"}
                }
            },
        },
        500: {
            "model": format_get_order_by_number_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
async def get_order_by_number(
    request: Request,
    number: Annotated[str, Query(description="訂單編號")],
    token: str = Depends(JWTBearer()),
):
    if not token:
        return format_get_order_by_number_response(status="unauthorized")
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM `orders` WHERE order_number = %s"
                cursor.execute(query, (number,))
                match_order = cursor.fetchone()
                if not match_order:
                    return None
                order_status = match_order["status"]
                status = 1 if order_status == "PAID" else 0
                data = {
                    "number": match_order["order_number"],
                    "price": match_order["price"],
                    "trip": {
                        "attraction": {
                            "id": match_order["attraction_id"],
                            "name": match_order["attraction_name"],
                            "address": match_order["attraction_address"],
                            "image": match_order["attraction_image"],
                        },
                        "date": match_order["trip_date"],
                        "time": match_order["trip_time"],
                    },
                    "contact": {
                        "name": match_order["contact_name"],
                        "email": match_order["contact_email"],
                        "phone": match_order["contact_phone"],
                    },
                    "status": status,
                }
                return format_get_order_by_number_response(data=data)
    except Exception as e:
        print(f"Error in getting order by number: {str(e)}")
        return format_get_order_by_number_response(status="server_error")
