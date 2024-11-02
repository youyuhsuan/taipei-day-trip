from enum import Enum
from datetime import date
from typing import Annotated
from pydantic import BaseModel, Field


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
