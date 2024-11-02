from fastapi.responses import JSONResponse
from model.orders import OrderPostInfo
from typing import Annotated
import json
import httpx

from config import settings

# Config
TAPPAY_SANDBOX_URL = settings.TAPPAY_SANDBOX_URL
PARTNER_KEY = settings.PARTNER_KEY
MERCHANT_ID = settings.MERCHANT_ID


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
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=order_info)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            content = {
                "error": True,
                "message": str(e),
            }
            return JSONResponse(
                status_code=500,
                content=content,
                media_type="application/json",
            )
