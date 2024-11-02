from fastapi import Request
from typing import Optional
from models.attractions import (
    fetch_attractions,
    count_attractions,
    fetch_single_attraction,
    fetch_single_attraction_images,
)
from views.attractions import (
    transform_attraction,
    format_attractions_response,
    format_single_attraction_response,
)


async def get_attractions_list(
    request: Request, page: int = 0, keyword: Optional[str] = ""
):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            offset = 12
            start_index = page * offset

            results_count = await count_attractions(con, keyword, start_index)
            attractions = await fetch_attractions(con, keyword, start_index, offset)
            if not attractions:
                return format_attractions_response(status="not_found")
            nextpage = page + 1 if results_count == 13 else None
            a = [transform_attraction(a) for a in attractions]
            return format_attractions_response(
                nextpage=nextpage,
                attractions=[transform_attraction(a) for a in attractions],
            )
    except Exception as e:
        print(f"Error in getting attractions list: {str(e)}")
        return format_attractions_response(status="server_error")


async def get_single_attraction(request: Request, attraction_id: int):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            attraction = await fetch_single_attraction(con, attraction_id)
            if not attraction:
                return format_single_attraction_response(status="not_found")
            image_data = await fetch_single_attraction_images(con, attraction_id)
            img_urls = [img["images"] for img in image_data]
            attraction["images"] = img_urls
            return format_single_attraction_response(data=attraction)
    except Exception as e:
        print(f"Error getting single attraction, ID {attraction_id}: {str(e)}")
        return format_single_attraction_response(status="server_error")
