from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/api/mrts", tags=["MRT Station"])
async def get_attractions_mrt(
    request: Request,
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = """SELECT attractions.mrt
                FROM attractions
                WHERE attractions.mrt IS NOT NULL
                GROUP BY attractions.mrt
                ORDER BY COUNT(*) DESC;
                """
                cursor.execute(query)
                results = cursor.fetchall()
                data = [result["mrt"] for result in results]
                return {"data": data}
    except Exception as e:
        raise JSONResponse(
            status_code=500,
            content="Internal server error",
            media_type="application/json",
        )
