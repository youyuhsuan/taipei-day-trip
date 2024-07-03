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
                insert_new_order = "INSERT INTO booking_order (booking_id, name, email, phone) VALUES (%s, %s, %s, %s)"
                cursor.execute(
                    insert_new_order,
                    (
                        match_booking["id"],
                        OrderPostInfo.order.contact.name,
                        OrderPostInfo.order.contact.email,
                        OrderPostInfo.order.contact.phone,
                    ),
                )
                order_id = cursor.lastrowid
                payment_result = await process_payment(OrderPostInfo)
                if payment_result["status"] != 0:
                    error_msg = payment_result["msg"]
                    return JSONResponse(
                        status_code=400,
                        content=error_msg,
                        media_type="application/json",
                    )
                delete_query = "DELETE FROM booking WHERE user_id = %s"
                cursor.execute(delete_query, (credentials["id"],))
                update_order = """
                    UPDATE booking_order
                    SET paid = %s,
                        order_number = %s,
                        acquirer = %s,
                        card_secret = %s,
                        rec_trade_id = %s,
                        bank_transaction_id = %s,
                        transaction_time_millis = %s,
                        bank_transaction_time = %s
                    WHERE id = %s
                """
                cursor.execute(
                    update_order,
                    (
                        1,
                        payment_result["rec_trade_id"],
                        payment_result["acquirer"],
                        json.dumps(payment_result["card_secret"]),
                        payment_result["rec_trade_id"],
                        payment_result["bank_transaction_id"],
                        payment_result["transaction_time_millis"],
                        json.dumps(payment_result["bank_transaction_time"]),
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
    orderNumber: Annotated[int, Query(description="訂單編號")],
    token: str = Depends(JWTBearer()),
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = """SELECT booking_order.booking_id, booking_order.name, booking_order.email, booking_order.phone, booking_order.paid, 
                        FROM booking_order
                        JOIN booking ON booking.id = booking_order.booking_id
                        WHERE order_number = %s"""
                cursor.execute(query, (orderNumber,))
                match_order = cursor.fetchone()
                if not match_order:
                    return None
                # query = """SELECT attractions.id, attractions.name, attractions.address, attractions_images.images AS image
                #         FROM attractions
                #         JOIN attractions_images ON attractions.id = attractions_images.attractions_id
                #         WHERE attractions.id = %s"""
                # cursor.execute(query, (match_order["booking_id"],))
                # match_attraction = cursor.fetchone()
                # if not match_attraction:
                #     return None
                # print(match_order, match_attraction)
                return {"data": "data"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content="Internal server error",
            media_type="application/json",
        )
