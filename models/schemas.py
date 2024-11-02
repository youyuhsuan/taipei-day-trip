from pydantic import BaseModel, Field
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
