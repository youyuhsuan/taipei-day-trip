from pydantic import BaseModel, Field, EmailStr
from typing import Annotated, List, Optional
from enum import Enum
from datetime import date


# Attraction
class AttractionBase(BaseModel):
    id: Annotated[int, Field(description="Unique identifier for the attraction")]
    name: Annotated[str, Field(description="Name of the attraction", min_length=1)]
    category: Annotated[
        str, Field(description="Category of the attraction", min_length=1)
    ]
    description: Annotated[
        str, Field(description="Detailed description of the attraction", min_length=1)
    ]
    address: Annotated[
        str, Field(description="Physical address of the attraction", min_length=1)
    ]
    transport: Annotated[
        str,
        Field(
            description="Transportation information to reach the attraction",
            min_length=1,
        ),
    ]
    mrt: Annotated[
        Optional[str], Field(description="Nearest MRT station to the attraction")
    ]
    lat: Annotated[
        float, Field(description="Latitude coordinate of the attraction", ge=-90, le=90)
    ]
    lng: Annotated[
        float,
        Field(description="Longitude coordinate of the attraction", ge=-180, le=180),
    ]


class AttractionDB(AttractionBase):
    imgs: Annotated[str, Field(description="Comma-separated URLs of attraction images")]


class Attraction(AttractionBase):
    images: Annotated[
        List[str], Field(description="List of image URLs for the attraction")
    ]


# Booking
class TimeOfDay(str, Enum):
    morning = "morning"
    afternoon = "afternoon"


class Price(int, Enum):
    morning_price = 2000
    afternoon_price = 2500


class BookAttraction(BaseModel):
    attractionId: Annotated[
        int, Field(description="Unique identifier for the attraction")
    ]
    date: Annotated[date, Field(description="Date of the booking (YYYY-MM-DD")]
    time: Annotated[TimeOfDay, Field(description="Time slot for the booking")]
    price: Annotated[
        Price,
        Field(
            description="Price of the bookingPrice of the booking",
        ),
    ]


# Order
class OrderStatus(str, Enum):
    PAID = "1"
    UNPAID = "0"


class AttractionSummary(BaseModel):
    id: Annotated[int, Field(description="Unique identifier for the attraction")]
    name: str
    address: str
    image: str


class TripDetails(BaseModel):
    date: Annotated[date, Field(description="Date of the booking (YYYY-MM-DD")]
    time: Annotated[TimeOfDay, Field(description="Time slot for the booking")]
    attraction: Annotated[
        AttractionSummary, Field(description="attraction(id,name,address,image)")
    ]


class ContactInfo(BaseModel):
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


class OrderBase(BaseModel):
    price: Annotated[
        Price,
        Field(
            description="Price of the bookingPrice of the booking",
        ),
    ]
    trip: Annotated[
        TripDetails,
        Field(
            description="Details of the trip including date, time, attraction information (id, name, address, image)"
        ),
    ]
    contact: Annotated[
        ContactInfo,
        Field(description="Contact information of the person placing the order"),
    ]


class OrderCreate(BaseModel):
    prime: Annotated[
        str,
        Field(
            description="Transaction code obtained from TapPay for payment processing"
        ),
    ]
    order: Annotated[
        OrderBase,
        Field(
            description="Transaction code obtained from TapPay for payment processing"
        ),
    ]


class OrderResponse(BaseModel):
    number: Annotated[
        str,
        Field(description="Order number"),
    ]
    price: Annotated[
        Price,
        Field(
            description="Price of the bookingPrice of the booking",
        ),
    ]
    trip: Annotated[
        TripDetails,
        Field(
            description="Details of the trip including date, time, attraction information (id, name, address, image)"
        ),
    ]
    contact: Annotated[
        ContactInfo,
        Field(description="Contact information of the person placing the order"),
    ]
    status: Annotated[
        OrderStatus,
        Field(description="Transaction code"),
    ]
