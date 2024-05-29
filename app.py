from fastapi import *
from fastapi.responses import FileResponse
from typing import Annotated, Optional, Union, Dict
from pydantic import BaseModel
import mysql.connector.pooling
import os

app = FastAPI()

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


@app.get("/api/attractions")
async def get_attractions(
    request: Request,
    page: Annotated[int, Query(description="要取得的分頁，每頁 12 筆資料", ge=0)] = 0,
    keyword: Annotated[
        Optional[str],
        Query(
            description="用來完全比對捷運站名稱、或模糊比對景點名稱的關鍵字，沒有給定則不做篩選"
        ),
    ] = "",
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                offset = 12
                start_index = page * offset
                nextpage = None
                if page >= 1:
                    nextpage = page + 1
                query = "select attractions.*,imgs.imgs from attractions join(select attractions_id,group_concat(images) as imgs from attractions_images group by attractions_id) as imgs on attractions.id=imgs.attractions_id WHERE (attractions.mrt = %s OR attractions.name LIKE %s) LIMIT %s,%s"
                cursor.execute(
                    query, (keyword, "%" + keyword + "%", start_index, offset)
                )
                results = cursor.fetchall()
                if results:
                    attractions = []
                    for result in results:
                        img_url = result["imgs"].split(",") if result["imgs"] else []
                        attraction = {
                            "id": result["id"],
                            "name": result["name"],
                            "category": result["category"],
                            "description": result["description"],
                            "address": result["address"],
                            "transport": result["transport"],
                            "mrt": result["mrt"],
                            "lat": result["lat"],
                            "lng": result["lng"],
                            "images": img_url,
                        }
                        attractions.append(attraction)
                    return {"nextpage": nextpage, "data": attractions}
                else:
                    return {"error": True, "message": "No data found matching criteria"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/attraction/{attractionId}")
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
                if data:
                    return {"data": data}
                else:
                    return {"error": True, "message": "No data found matching criteria"}
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