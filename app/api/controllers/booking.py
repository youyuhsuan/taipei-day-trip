from fastapi import Request
from ..routers import user
from ..views.booking import (
    format_booking_response,
    format_create_booking_response,
    format_delete_booking_response,
)
from ..models.booking import (
    fetch_booking,
    fetch_attraction,
    check_booking_exists,
    create_new_booking,
    delete_user_bookings,
)
from ..schemas.schemas import BookAttraction


# GET
async def get_booking(request: Request, token: str):
    if not token:
        return format_booking_response(status="unauthorized")

    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            credentials = user.decodeJWT(token)
            booking = await fetch_booking(con, credentials["id"])

            if not booking:
                return format_booking_response(status="not_found_booking")

            attraction = await fetch_attraction(con, booking["attraction_id"])
            if not attraction:
                return format_booking_response(status="not_found_attraction")

            data = {
                "attraction": {
                    "id": attraction["id"],
                    "name": attraction["name"],
                    "address": attraction["address"],
                    "image": attraction["image"],
                },
                "date": booking["date"],
                "time": booking["time"],
                "price": booking["price"],
            }
            return format_booking_response(data=data)
    except Exception as e:
        print(f"Error in getting booking with attraction: {str(e)}")
        return format_booking_response(status="server_error")


# POST
async def post_booking(request: Request, BookAttraction: BookAttraction, token: str):
    if not token:
        return format_create_booking_response(status="unauthorized")

    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            # Check if booking already exists
            existing_booking = await check_booking_exists(
                con,
                BookAttraction.attractionId,
                BookAttraction.date,
                BookAttraction.time.value,
            )
            if existing_booking:
                content = {
                    "error": True,
                    "message": f"Attraction already booked on {BookAttraction.date} at {BookAttraction.time}",
                }
                return format_create_booking_response(
                    status="match_book", content=content
                )

            credentials = user.decodeJWT(token)
            await create_new_booking(
                con,
                BookAttraction.attractionId,
                credentials["id"],
                BookAttraction.date,
                BookAttraction.time.value,
                BookAttraction.price.value,
            )
            con.commit()
            return format_create_booking_response()
    except Exception as e:
        print(f"Error in creating booking: {str(e)}")
        return format_create_booking_response(status="server_error")


# DELETE
async def delete_booking(request: Request, token: str):
    if not token:
        return format_delete_booking_response(status="unauthorized")

    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            credentials = user.decodeJWT(token)
            await delete_user_bookings(con, credentials["id"])
            con.commit()
            return format_delete_booking_response()
    except Exception as e:
        print(f"Error in deleting booking: {str(e)}")
        return format_delete_booking_response(status="server_error")
