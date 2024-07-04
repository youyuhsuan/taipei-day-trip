from typing import Annotated
from fastapi import APIRouter, Query, Request, Depends
from fastapi.responses import JSONResponse
import json
import requests
from routers import user
from model.JWTAuthenticator import JWTBearer
from model.orders import OrderPostInfo


router = APIRouter()

TAPPAY_SANDBOX_URL = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
PARTNER_KEY = "partner_my6Z83zgO0FyIusd1ZjWVEyVYWgYbWsFwP4rgS6XdqO5HRIKhi2Kih7U"
MERCHANT_ID = "merchantA"


@router.post("/api/orders", tags=["Order"])
async def post_orders(
    request: Request, OrderPostInfo: OrderPostInfo, token: str = Depends(JWTBearer())
) -> dict:
    if not token:
        content = {
            "error": True,
            "message": "Unauthorized access",
        }
        return JSONResponse(
            status_code=403,
            content=content,
            media_type="application/json",
        )
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                credentials = user.decodeJWT(token)
                query = "SELECT id FROM booking WHERE attraction_id = %s AND user_id = %s AND date = %s AND time = %s AND price = %s"
                cursor.execute(
                    query,
                    (
                        OrderPostInfo.order.trip.attraction.id,
                        credentials["id"],
                        OrderPostInfo.order.trip.date,
                        OrderPostInfo.order.trip.time,
                        OrderPostInfo.order.price.value,
                    ),
                )
                match_booking = cursor.fetchone()
                if not match_booking:
                    content = {
                        "error": True,
                        "message": "Matching booking not found",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
                insert_new_order = """
                    INSERT INTO `orders` (
                        booking_id, user_id, price, attraction_id, attraction_name, 
                        attraction_address, attraction_image, trip_date, trip_time, 
                        contact_name, contact_email, contact_phone
                    ) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(
                    insert_new_order,
                    (
                        match_booking["id"],
                        credentials["id"],
                        OrderPostInfo.order.price.value,
                        OrderPostInfo.order.trip.attraction.id,
                        OrderPostInfo.order.trip.attraction.name,
                        OrderPostInfo.order.trip.attraction.address,
                        OrderPostInfo.order.trip.attraction.image,
                        OrderPostInfo.order.trip.date,
                        OrderPostInfo.order.trip.time,
                        OrderPostInfo.order.contact.name,
                        OrderPostInfo.order.contact.email,
                        OrderPostInfo.order.contact.phone,
                    ),
                )
                order_id = cursor.lastrowid
                payment_result = await process_payment(OrderPostInfo)
                if payment_result["status"] != 0:
                    update_order = """
                    UPDATE `orders`
                    SET status = %s,
                        order_number = %s,
                        rec_trade_id = %s
                    WHERE id = %s
                    """
                    cursor.execute(
                        update_order,
                        (
                            "FAILED",
                            payment_result["rec_trade_id"],
                            payment_result["rec_trade_id"],
                            order_id,
                        ),
                    )
                    content = {
                        "data": {
                            "number": payment_result["rec_trade_id"],
                            "payment": {
                                "status": payment_result["status"],
                                "message": "付款失敗",
                            },
                        }
                    }
                    con.commit()
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
                update_order = """
                    UPDATE `orders`
                    SET status = %s,
                        order_number = %s,
                        acquirer = %s,
                        card_secret = %s,
                        rec_trade_id = %s,
                        bank_transaction_id = %s
                    WHERE id = %s
                """
                cursor.execute(
                    update_order,
                    (
                        "PAID",
                        payment_result["rec_trade_id"],
                        payment_result["acquirer"],
                        json.dumps(payment_result["card_secret"]),
                        payment_result["rec_trade_id"],
                        payment_result["bank_transaction_id"],
                        order_id,
                    ),
                )
                con.commit()
                return {
                    "data": {
                        "number": payment_result["rec_trade_id"],
                        "payment": {
                            "status": payment_result["status"],
                            "message": "付款成功",
                        },
                    }
                }
    except Exception as e:
        content = {
            "error": True,
            "message": e,
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


async def process_payment(OrderPostInfo: OrderPostInfo) -> dict:
    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    headers = {"Content-Type": "application/json", "x-api-key": PARTNER_KEY}
    order_info = {
        "prime": OrderPostInfo.prime,
        "partner_key": PARTNER_KEY,
        "merchant_id": "tppf_stella0118_GP_POS_1",
        "amount": OrderPostInfo.order.price.value,
        "details": json.dumps(
            [
                {
                    "item_id": OrderPostInfo.order.trip.attraction.id,
                    "item_name": OrderPostInfo.order.trip.attraction.name,
                    "item_price": OrderPostInfo.order.price.value,
                }
            ]
        ),
        "cardholder": {
            "phone_number": OrderPostInfo.order.contact.phone,
            "name": OrderPostInfo.order.contact.name,
            "email": OrderPostInfo.order.contact.email,
        },
        "remember": True,
    }
    try:
        response = requests.post(url, headers=headers, json=order_info)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        content = {
            "error": True,
            "message": e,
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


@router.get("/api/orders", tags=["Order"])
async def get_orders(
    request: Request,
    number: Annotated[str, Query(description="訂單編號")],
    token: str = Depends(JWTBearer()),
):
    if not token:
        content = {
            "error": True,
            "message": "Unauthorized access",
        }
        return JSONResponse(
            status_code=403,
            content=content,
            media_type="application/json",
        )
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
                return {"data": data}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content="Internal server error",
            media_type="application/json",
        )
