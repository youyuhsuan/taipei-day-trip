from enum import Enum
from typing import Annotated
from datetime import date
from pydantic import BaseModel, EmailStr, Field


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
