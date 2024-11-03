import re
import json
from app.core.config import settings

db_config = {
    "host": settings.MYSQL_HOST,
    "port": settings.MYSQL_PORT,
    "database": settings.MYSQL_DATABASE,
    "user": settings.MYSQL_USER,
    "password": settings.MYSQL_PASSWORD,
}

with open("data/taipei-attractions.json", "r") as taipei_attractions:
    file = json.load(taipei_attractions)
    attractions = file["result"]["results"]
    for attraction in attractions:
        id = attraction["_id"]
        name = attraction["name"]
        category = attraction["CAT"]
        description = attraction["description"]
        address = re.sub(r"\s+", "", attraction["address"]).strip()
        transport = attraction["direction"]
        mrt = attraction["MRT"]
        lat = float(attraction["latitude"])
        lng = float(attraction["longitude"])
        file = attraction["file"].lower()
        clear_file = re.findall(r"https?://[^\s]+?\.jpg", file)
        with db_config.cursor() as cursor:
            insert_attractions = "INSERT INTO attractions (name, category, description, address, transport, mrt, lat, lng) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            insert_attractions_values = (
                name,
                category,
                description,
                address,
                transport,
                mrt,
                lat,
                lng,
            )
            cursor.execute(insert_attractions, insert_attractions_values)
            db_config.commit()
            current_id = cursor.lastrowid
            insert_attractions_images = (
                "INSERT INTO attractions_images (attractions_id,images) VALUES (%s,%s)"
            )
            for file in clear_file:
                cursor.execute(insert_attractions_images, (current_id, file))
                db_config.commit()
