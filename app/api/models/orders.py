import json
import httpx
from app.core.config import settings

# Config
TAPPAY_SANDBOX_URL = settings.TAPPAY_SANDBOX_URL
PARTNER_KEY = settings.PARTNER_KEY


# POST
async def find_matching_booking(con, order_info, user_id):
    query = """
    SELECT id FROM booking 
    WHERE attraction_id = %s AND user_id = %s AND date = %s AND time = %s AND price = %s
    """
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(
            query,
            (
                order_info.order.trip.attraction.id,
                user_id,
                order_info.order.trip.date,
                order_info.order.trip.time.value,
                order_info.order.price.value,
            ),
        )
        return cursor.fetchone()


async def insert_order(con, order_info, user_id, booking_id):
    insert_new_order = """
    INSERT INTO `orders` (
        booking_id, user_id, price, attraction_id, attraction_name, 
        attraction_address, attraction_image, trip_date, trip_time, 
        contact_name, contact_email, contact_phone
    ) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    with con.cursor() as cursor:
        cursor.execute(
            insert_new_order,
            (
                booking_id,
                user_id,
                order_info.order.price.value,
                order_info.order.trip.attraction.id,
                order_info.order.trip.attraction.name,
                order_info.order.trip.attraction.address,
                order_info.order.trip.attraction.image,
                order_info.order.trip.date,
                order_info.order.trip.time.value,
                order_info.order.contact.name,
                order_info.order.contact.email,
                order_info.order.contact.phone,
            ),
        )
        return cursor.lastrowid


async def update_order_status(con, order_id, status, payment_result):
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
    with con.cursor() as cursor:
        cursor.execute(
            update_order,
            (
                status,
                payment_result["rec_trade_id"],
                payment_result["acquirer"],
                json.dumps(payment_result["card_secret"]),
                payment_result["rec_trade_id"],
                payment_result["bank_transaction_id"],
                order_id,
            ),
        )


# GET
async def get_order_by_number(con, order_number):
    query = "SELECT * FROM `orders` WHERE order_number = %s"
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query, (order_number,))
        return cursor.fetchone()


# PROCESS PAYMENT API
async def process_payment_api(order_info) -> dict:
    url = TAPPAY_SANDBOX_URL
    headers = {"Content-Type": "application/json", "x-api-key": PARTNER_KEY}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=order_info)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            return {"error": True, "message": str(e)}
