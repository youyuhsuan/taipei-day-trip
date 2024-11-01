import re
import json
from config import settings

db_config = {
    "host": settings.DB_HOST,
    "port": settings.DB_PORT,
    "database": settings.DB_DATABASE,
    "user": settings.DB_USER,
    "password": settings.DB_PASSWORD,
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
