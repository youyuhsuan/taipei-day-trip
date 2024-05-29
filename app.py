from fastapi import *
from fastapi.responses import FileResponse
from typing import Annotated, Optional, Union, Dict
from pydantic import BaseModel
import mysql.connector.pooling
import os


# from router import user, attraction, mrt_station, booking, order
# from modules import pool


app = FastAPI()

# API
# app.include_router(user.router)
# app.include_router(attraction.router)
# app.include_router(mrt_station.router)
# app.include_router(booking.router)
# app.include_router(order.router)

dbconfig = {
    "database": "taipei_attractions",
    "user": "root",
    "password": os.environ["MYSQL_PASSWORD"],
}


@app.middleware("http")
async def attach_db_connection(request: Request, call_next):
    request.state.db_pool = cnxpool
    response = await call_next(request)
    return response


# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./static/index.html", media_type="text/html")


@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
    return FileResponse("./static/attraction.html", media_type="text/html")


@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
    return FileResponse("./static/booking.html", media_type="text/html")


@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
    return FileResponse("./static/thankyou.html", media_type="text/html")


cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool", pool_size=5, **dbconfig
)


class SuccecssResponse(BaseModel):
    data: dict


class ErrorResponse(BaseModel):
    error: bool = True
    message: str = ""


@app.get("/api/attractions")
async def get_attractions(
    request: Request,
    page: Annotated[int, Query(description="要取得的分頁，每頁 12 筆資料", ge=0)] = 0,
    keyword: Annotated[
        Optional[str],
        Query(
            description="用來完全比對捷運站名稱、或模糊比對景點名稱的關鍵字，沒有給定則不做篩選"
        ),
    ] = None,
):
    db_pool = request.state.db_pool
    try:
        async with db_pool.acquire() as con:
            async with con.cursor(dictionary=True) as cursor:
                offset = 12
                start_index = page * offset
                query = """
                SELECT attractions.*, images.images
                FROM attractions
                INNER JOIN (
                    SELECT attractions_id, GROUP_CONCAT(images) AS images
                    FROM attractions_images
                    GROUP BY attractions_id
                ) AS images
                ON attractions.id = images.attractions_id
                WHERE (attractions.mrt = %s OR attractions.name LIKE %s)
                LIMIT %s OFFSET %s;
                """
                cursor.execute(
                    query, (keyword, "%" + keyword + "%", start_index, offset)
                )
                data = cursor.fetchall()
                return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get(
    "/api/attraction/{attractionId}",
    response_model=Union[SuccecssResponse, ErrorResponse],
)
async def get_attractions_attractionId(
    request: Request,
    attractionId: Annotated[int, Path(description="景點編號")],
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = """
                SELECT attractions.*, images.images
                FROM attractions
                INNER JOIN (
                    SELECT attractions_id, GROUP_CONCAT(images) AS images
                    FROM attractions_images
                    GROUP BY attractions_id
                ) AS images
                ON attractions.id = images.attractions_id 
                WHERE attractions.id = %s;
                """
                cursor.execute(query, (attractionId,))
                data = cursor.fetchall()
                if data is not None:
                    return {"data": data}
                else:
                    responses = ErrorResponse(
                        status_code=status.HTTP_402_PAYMENT_REQUIRED,
                        error=True,
                        message="No data found matching criteria",
                    )
                    return responses
    except Exception as e:
        raise HTTPException(status_code=500, message="Internal server error")


@app.get("/api/mrts")
async def get_attractions_mrt(
    request: Request,
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT MRT,count(MRT) AS attractions_count FROM attractions GROUP BY attractions.mrt ORDER BY attractions_count DESC;"
                cursor.execute(query)
                data = cursor.fetchall()
                return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, message="Internal server error")
