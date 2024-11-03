# GET
async def fetch_booking(con, user_id: int):
    query = "SELECT * FROM booking WHERE user_id = %s"
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query, (user_id,))
        return cursor.fetchone()


async def fetch_attraction(con, attraction_id: int):
    query = """
    SELECT attractions.id, attractions.name, attractions.address, attractions_images.images AS image
    FROM attractions
    JOIN attractions_images ON attractions.id = attractions_images.attractions_id
    WHERE attractions.id = %s
    LIMIT 1;
    """
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query, (attraction_id,))
        return cursor.fetchone()


# POST
async def check_booking_exists(con, attraction_id: int, date: str, time: str):
    query = (
        "SELECT id FROM booking WHERE attraction_id = %s AND date = %s AND time = %s"
    )
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query, (attraction_id, date, time))
        return cursor.fetchone()


async def create_new_booking(
    con, attraction_id: int, user_id: int, date: str, time: str, price: float
):
    insert_new_book = """
        INSERT INTO booking (attraction_id, user_id, date, time, price) 
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        attraction_id = VALUES(attraction_id),
        date = VALUES(date),
        time = VALUES(time),
        price = VALUES(price)
    """
    with con.cursor() as cursor:
        cursor.execute(insert_new_book, (attraction_id, user_id, date, time, price))


# DELETE
async def delete_user_bookings(con, user_id: int):
    delete_query = "DELETE FROM booking WHERE user_id = %s"
    with con.cursor() as cursor:
        cursor.execute(delete_query, (user_id,))
