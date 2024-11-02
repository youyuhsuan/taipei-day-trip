from pydantic import BaseModel, Field
from typing import Annotated, List, Optional


class AttractionBase(BaseModel):
    id: Annotated[int, Field(description="Unique identifier for the attraction")]
    name: str
    category: str
    description: str
    address: str
    transport: str
    mrt: Optional[str]
    lat: float
    lng: float


class AttractionDB(AttractionBase):
    imgs: str


class Attraction(AttractionBase):
    images: str
