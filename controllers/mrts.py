from fastapi import Request
from views.mrts import format_mrt_stations_response
from models.mrts import fetch_mrt_stations


async def get_mrt(request: Request):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            results = await fetch_mrt_stations(con)
            data = [result["mrt"] for result in results]
            return format_mrt_stations_response(data=data)
    except Exception as e:
        print(f"Error in getting attractions MRT stations: {str(e)}")
        return format_mrt_stations_response(status="server_error")
