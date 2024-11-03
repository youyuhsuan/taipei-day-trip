async def fetch_mrt_stations(con):
    query = """
    SELECT attractions.mrt
    FROM attractions
    WHERE attractions.mrt IS NOT NULL
    GROUP BY attractions.mrt
    ORDER BY COUNT(*) DESC;
    """
    with con.cursor(dictionary=True) as cursor:
        cursor.execute(query)
        return cursor.fetchall()
