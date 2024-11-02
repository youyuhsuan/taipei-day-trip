from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from view.mrts import format_mrt_stations_response

router = APIRouter()


@router.get(
    "/api/mrts",
    tags=["MRT Station"],
    responses={
        200: {
            "model": format_mrt_stations_response,
            "description": "Successfully retrieved MRT stations",
            "content": {
                "application/json": {
                    "example": {
                        "data": ["台北車站", "中山站", "大安站", "信義安和", "象山"]
                    }
                }
            },
        },
        500: {
            "model": format_mrt_stations_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": True, "message": "Internal server error"}
                }
            },
        },
    },
)
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
                return format_mrt_stations_response(data=data)
    except Exception as e:
        print(f"Error in getting attractions MRT stations: {str(e)}")
        format_mrt_stations_response(status="server_error")
