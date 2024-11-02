from pydantic import BaseModel, Field
from typing import Annotated, List, Optional


class Attraction(BaseModel):
    id: Annotated[int, Field(description="Unique identifier for the attraction")]
    name: str
    category: str
    description: str
    address: str
    transport: str
    mrt: Optional[str]
    lat: float
    lng: float
    images: List[str]


class AttractionResponse(BaseModel):
    nextPage: Optional[int]
    data: List[Attraction]
