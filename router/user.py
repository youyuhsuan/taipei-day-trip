from fastapi import APIRouter, Request, Query, Path, HTTPException
from typing import Annotated


router = APIRouter(
    prefix="/api",
    tags=["User"],
)
