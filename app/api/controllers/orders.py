from fastapi import Request
import json

from ..routers import user
from ..schemas.schemas import OrderCreate
from ..models.orders import (
    find_matching_booking,
    insert_order,
    update_order_status,
    get_order_by_number,
    process_payment_api,
)
from ..views.orders import (
    format_create_order_response,
    format_get_order_by_number_response,
    format_payment_response,
)

from app.core.config import settings

PARTNER_KEY = settings.PARTNER_KEY


# POST
async def post_create_order(request: Request, OrderCreate: OrderCreate, token: str):
    if not token:
        return format_create_order_response(status="unauthorized")
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            credentials = user.decodeJWT(token)
            match_booking = await find_matching_booking(
                con, OrderCreate, credentials["id"]
            )
            if not match_booking:
                return format_create_order_response(status="invalid_booking")

            order_id = await insert_order(
                con, OrderCreate, credentials["id"], match_booking["id"]
            )
            payment_result = await handle_payment(OrderCreate)
            if payment_result["status"] != 0:
                await update_order_status(con, order_id, "FAILED", payment_result)
                data = {
                    "number": payment_result["rec_trade_id"],
                    "payment": {
                        "status": payment_result["status"],
                        "message": "付款失敗",
                    },
                }
                return format_create_order_response(status="payment_failure", data=data)

            await update_order_status(con, order_id, "PAID", payment_result)
            data = {
                "number": payment_result["rec_trade_id"],
                "payment": {
                    "status": payment_result["status"],
                    "message": "付款成功",
                },
            }
            return format_create_order_response(data=data)

    except Exception as e:
        print(f"Error in creating order: {str(e)}")
        return format_create_order_response(status="server_error")


async def handle_payment(OrderCreate) -> dict:
    order_info = {
        "prime": OrderCreate.prime,
        "partner_key": PARTNER_KEY,
        "merchant_id": "tppf_stella0118_GP_POS_1",
        "amount": OrderCreate.order.price.value,
        "details": json.dumps(
            [
                {
                    "item_id": OrderCreate.order.trip.attraction.id,
                    "item_name": OrderCreate.order.trip.attraction.name,
                    "item_price": OrderCreate.order.price.value,
                }
            ]
        ),
        "cardholder": {
            "phone_number": OrderCreate.order.contact.phone,
            "name": OrderCreate.order.contact.name,
            "email": OrderCreate.order.contact.email,
        },
        "remember": True,
    }

    data = await process_payment_api(order_info)
    if isinstance(data, dict) and data.get("error"):
        return format_payment_response(status="server_error", data=data)
    return format_payment_response(data=data)


# GET
async def get_order(request: Request, number: str, token: str):
    if not token:
        return format_get_order_by_number_response(status="unauthorized")
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            match_order = await get_order_by_number(con, number)
            if not match_order:
                return format_get_order_by_number_response(status="order_not_found")

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
