from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from routers import user
from model.booking import BookAttraction
from model.JWTAuthenticator import JWTBearer, CustomHTTPException

router = APIRouter()


@router.get("/api/booking", tags=["Booking"])
async def get_booking(request: Request, token: str = Depends(JWTBearer())):
    if not token:
        return None
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                credentials = user.decodeJWT(token)
                query = "SELECT * FROM booking WHERE user_id = %s"
                cursor.execute(query, (credentials["id"],))
                match_booking = cursor.fetchone()
                if not match_booking:
                    return None
                query = """
                SELECT attractions.id, attractions.name, attractions.address, attractions_images.images AS image
                FROM attractions
                JOIN attractions_images ON attractions.id = attractions_images.attractions_id
                WHERE attractions.id = %s
                LIMIT 1;"""
                cursor.execute(query, (match_booking["attraction_id"],))
                match_attraction = cursor.fetchone()
                if not match_attraction:
                    return None
                data = {
                    "attraction": {
                        "id": match_attraction["id"],
                        "name": match_attraction["name"],
                        "address": match_attraction["address"],
                        "image": match_attraction["image"],
                    },
                    "date": match_booking["date"],
                    "time": match_booking["time"],
                    "price": match_booking["price"],
                }
                return {"data": data}

    except Exception as e:
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


@router.post("/api/booking", tags=["Booking"])
async def post_booking(
    request: Request, BookAttraction: BookAttraction, token: str = Depends(JWTBearer())
) -> dict:
    if not token:
        content = {
            "error": True,
            "message": "Unauthorized access",
        }
        return JSONResponse(
            status_code=403,
            content=content,
            media_type="application/json",
        )
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT id FROM booking WHERE attraction_id = %s AND date = %s AND time = %s"
                cursor.execute(
                    query,
                    (
                        BookAttraction.attractionId,
                        BookAttraction.date,
                        BookAttraction.time,
                    ),
                )
                match_book = cursor.fetchone()
                if match_book:
                    content = {
                        "error": True,
                        "message": f"Attraction already booked on {BookAttraction.date} at {BookAttraction.time}",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
                else:
                    credentials = user.decodeJWT(token)
                    insert_new_book = """
                        INSERT INTO booking (attraction_id, user_id, date, time, price) 
                        VALUES (%s, %s, %s, %s, %s)
                        ON DUPLICATE KEY UPDATE
                        attraction_id = VALUES(attraction_id),
                        date = VALUES(date),
                        time = VALUES(time),
                        price = VALUES(price)
                    """
                    cursor.execute(
                        insert_new_book,
                        (
                            BookAttraction.attractionId,
                            credentials["id"],
                            BookAttraction.date,
                            BookAttraction.time,
                            BookAttraction.price.value,
                        ),
                    )
                    con.commit()
                    data = {"ok": True}
                    return JSONResponse(content=data, media_type="application/json")
    except Exception as e:
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


@router.delete("/api/booking", tags=["Booking"])
async def delete_booking(request: Request, token: str = Depends(JWTBearer())):
    if not token:
        content = {
            "error": True,
            "message": "Unauthorized access",
        }
        return JSONResponse(
            status_code=403,
            content=content,
            media_type="application/json",
        )
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                credentials = user.decodeJWT(token)
                delete_query = "DELETE FROM booking WHERE user_id = %s"
                cursor.execute(delete_query, (credentials["id"],))
                con.commit()
                return {
                    "ok": True,
                }
    except Exception as e:
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )
