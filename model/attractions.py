from typing import Tuple, List, Dict, Any
from model.schemas import Attraction


class AttractionModel:
    @staticmethod
    async def get_attractions_list(
        db_pool, keyword: str, start_index: int, offset: int
    ) -> Tuple[List[Dict[str, Any]], int]:
        try:
            with db_pool.get_connection() as con:
                with con.cursor(dictionary=True) as cursor:
                    next_page_count = AttractionModel._check_next_page(
                        cursor, keyword, start_index
                    )
                    raw_data = AttractionModel._fetch_attractions_with_images(
                        cursor, keyword, start_index, offset
                    )

                    # Convert raw data to Attraction objects
                    attractions = [
                        AttractionModel.format_attraction_data(item)
                        for item in raw_data
                    ]

                    return attractions, next_page_count
        except Exception as e:
            print(f"Database error in get_attractions_list: {str(e)}")
            raise

    @staticmethod
    def _check_next_page(cursor, keyword: str, start_index: int) -> int:
        query = """
        SELECT id FROM attractions 
        WHERE (mrt = %s OR name LIKE %s) 
        LIMIT %s,13
        """
        cursor.execute(query, (keyword, f"%{keyword}%", start_index))
        return len(cursor.fetchall())

    @staticmethod
    def _fetch_attractions_with_images(
        cursor, keyword: str, start_index: int, offset: int
    ) -> List[Dict[str, Any]]:
        query = """
        SELECT attractions.*,imgs.imgs 
        FROM attractions 
        JOIN(SELECT attractions_id,group_concat(images) AS imgs 
        FROM attractions_images GROUP BY attractions_id) AS imgs 
        ON attractions.id=imgs.attractions_id 
        WHERE (attractions.mrt = %s OR attractions.name LIKE %s) 
        LIMIT %s,%s
        """
        cursor.execute(query, (keyword, f"%{keyword}%", start_index, offset))
        return cursor.fetchall()

    @staticmethod
    def format_attraction_data(result: dict) -> Dict[str, Any]:
        return {
            "id": result["id"],
            "name": result["name"],
            "category": result["category"],
            "description": result["description"],
            "address": result["address"],
            "transport": result["transport"],
            "mrt": result["mrt"],
            "lat": result["lat"],
            "lng": result["lng"],
            "images": result["imgs"].split(",") if result["imgs"] else [],
        }
