from fastapi import APIRouter, Request
from typing import Annotated, Optional
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/api/booking")
async def get_booking(
    request: Request,
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connect() as con:
            with con.cursor(dictionary=True) as cursor:
                pass
    except Exception as e:
        pass
