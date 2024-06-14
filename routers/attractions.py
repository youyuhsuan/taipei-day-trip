from fastapi import APIRouter, Request, Query, Path
from typing import Annotated, Optional
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/api/attractions")
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
                query_next_page = "SELECT id FROM attractions WHERE (mrt = %s OR name LIKE %s) LIMIT %s,13"
                cursor.execute(
                    query_next_page, (keyword, "%" + keyword + "%", start_index)
                )
                results = cursor.fetchall()
                results_count = len(results)

                query = """SELECT attractions.*,imgs.imgs 
                FROM attractions 
                JOIN(SELECT attractions_id,group_concat(images) AS imgs 
                FROM attractions_images GROUP BY attractions_id) AS imgs 
                ON attractions.id=imgs.attractions_id 
                WHERE (attractions.mrt = %s OR attractions.name LIKE %s) LIMIT %s,%s"""
                cursor.execute(
                    query, (keyword, "%" + keyword + "%", start_index, offset)
                )
                results = cursor.fetchall()
                nextpage = page + 1 if results_count == 13 else None

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
                    return {"nextPage": nextpage, "data": attractions}
                else:
                    content = {
                        "error": True,
                        "message": "No data found matching criteria",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content="Internal server error",
            media_type="application/json",
        )


@router.get("/api/attraction/{attractionId}")
async def get_attractions_attractionId(
    request: Request,
    attractionId: Annotated[int, Path(description="景點編號")],
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = """
                select attractions.*,GROUP_CONCAT(attractions_images.images) AS images from attractions join attractions_images on attractions.id = attractions_images.attractions_id where attractions.id = %s;
                """
                cursor.execute(query, (attractionId,))
                data = cursor.fetchone()
                if data:
                    img_url = data["images"].split(",") if data["images"] else []
                    data["images"] = img_url
                    return {"data": data}
                else:
                    content = {
                        "error": True,
                        "message": "No data found matching criteria",
                    }
                    return JSONResponse(
                        status_code=400, content=content, media_type="application/json"
                    )
    except Exception as e:
        return JSONResponse(status_code=500, content="Internal server error")
