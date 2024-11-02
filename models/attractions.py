from models.schemas import AttractionDB


async def fetch_attractions(con, keyword: str, start_index: int, offset: int):
    query = """
    SELECT attractions.*, imgs.imgs 
    FROM attractions 
    JOIN (SELECT attractions_id, GROUP_CONCAT(images) AS imgs 
          FROM attractions_images GROUP BY attractions_id) AS imgs 
    ON attractions.id = imgs.attractions_id 
    WHERE (attractions.mrt = %s OR attractions.name LIKE %s) 
    LIMIT %s, %s
    """
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query, (keyword, "%" + keyword + "%", start_index, offset))
        results = cursor.fetchall()
        return [AttractionDB(**result) for result in results]


async def count_attractions(con, keyword: str, start_index: int):
    query = "SELECT id FROM attractions WHERE (mrt = %s OR name LIKE %s) LIMIT %s, 13"
    with con.cursor() as cursor:
        cursor.execute(query, (keyword, "%" + keyword + "%", start_index))
        return len(cursor.fetchall())


async def fetch_single_attraction(con, attraction_id: int):
    query = "SELECT * FROM attractions WHERE id = %s;"
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query, (attraction_id,))
        return cursor.fetchone()


async def fetch_single_attraction_images(con, attraction_id: int):
    query = "SELECT images FROM attractions_images WHERE attractions_id = %s;"
    with con.cursor() as cursor:
        cursor.execute(query, (attraction_id,))
        return cursor.fetchall()
