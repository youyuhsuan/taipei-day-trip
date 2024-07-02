from enum import Enum
from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Annotated
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from pydantic import BaseModel, EmailStr, Field
from fastapi.responses import JSONResponse
import requests
from requests import get
from routers.booking import ALGORITHM, SECRET_KEY, CustomHTTPException

router = APIRouter()

TAPPAY_SANDBOX_URL = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
PARTNER_KEY = "partner_my6Z83zgO0FyIusd1ZjWVEyVYWgYbWsFwP4rgS6XdqO5HRIKhi2Kih7U"
MERCHANT_ID = "merchantA"


class TimeOfDay(str, Enum):
    morning = "morning"
    afternoon = "afternoon"


class Price(int, Enum):
    morning_price = 2000
    afternoon_price = 2500


class Attraction(BaseModel):
    id: Annotated[int, Field(description="Unique identifier for the attraction")]
    name: str
    address: str
    image: str


class Trip(BaseModel):
    date: Annotated[date, Field(description="Date of the booking (YYYY-MM-DD")]
    time: Annotated[TimeOfDay, Field(description="Time slot for the booking")]
    attraction: Annotated[
        Attraction, Field(description="attraction(id,name,address,image)")
    ]


class Contact(BaseModel):
    name: Annotated[str, Field(description="Name of the person placing the order")]
    email: Annotated[
        EmailStr, Field(description="Email of the person placing the order")
    ]
    phone: Annotated[
        str,
        Field(
            description="Phone number of the person placing the order",
            max_length=10,
        ),
    ]


class Order(BaseModel):
    price: Annotated[
        Price,
        Field(
            description="Price of the bookingPrice of the booking",
        ),
    ]
    trip: Annotated[
        Trip,
        Field(
            description="Details of the trip including date, time, attraction information (id, name, address, image)"
        ),
    ]
    contact: Annotated[
        Contact,
        Field(description="Contact information of the person placing the order"),
    ]


class OrderInfo(BaseModel):
    prime: Annotated[
        str,
        Field(
            description="Transaction code obtained from TapPay for payment processing"
        ),
    ]
    order: Annotated[
        Order,
        Field(
            description="Transaction code obtained from TapPay for payment processing"
        ),
    ]


class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, error: bool, message: str):
        super().__init__(
            status_code=status_code, detail={"error": error, "message": message}
        )
        self.error = error
        self.message = message


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if credentials.scheme != "Bearer":
                raise CustomHTTPException(
                    status_code=403, error=True, message="Invalid authentication scheme"
                )
            if not self.verify_jwt(credentials.credentials):
                raise CustomHTTPException(
                    status_code=403,
                    error=True,
                    message="Invalid token or expired token",
                )
            return credentials.credentials
        else:
            raise CustomHTTPException(
                status_code=403, error=True, message="Invalid authorization code"
            )

    def verify_jwt(self, jwt_token: str) -> bool:
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload["exp"] >= datetime.now(timezone.utc).timestamp()
        except:
            return False


@router.post("/api/orders", tags=["Order"])
async def post_orders(
    request: Request, OrderInfo: OrderInfo, token: str = Depends(JWTBearer())
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
    try:
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        headers = {"Content-Type": "application/json", "x-api-key": PARTNER_KEY}
        order_info = {
            "prime": OrderInfo.prime,
            "partner_key": "partner_my6Z83zgO0FyIusd1ZjWVEyVYWgYbWsFwP4rgS6XdqO5HRIKhi2Kih7U",
            "merchant_id": "merchantA",
            "details": "TapPay Test",
            "amount": OrderInfo.order.price,
            "cardholder": {
                "phone_number": OrderInfo.order.contact.phone,
                "name": OrderInfo.order.contact.name,
                "email": OrderInfo.order.contact.email,
                # "zip_code": "100",
                # "address": "台北市天龍區芝麻街1號1樓",
                # "national_id": "A123456789",
            },
            "remember": True,
        }
        try:
            response = requests.post(url, json=order_info, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise HTTPException(
                status_code=500, detail=f"Payment request failed: {str(e)}"
            )

    except Exception as e:
        print(e)
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )
