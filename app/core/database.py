from mysql.connector.pooling import MySQLConnectionPool
import mysql.connector.pooling
from app.core.config import Settings


def create_db_pool(settings: Settings) -> MySQLConnectionPool:
    try:
        db_config = {
            "host": settings.MYSQL_HOST,
            "port": settings.MYSQL_PORT,
            "database": settings.MYSQL_DATABASE,
            "user": settings.MYSQL_USER,
            "password": settings.MYSQL_PASSWORD,
        }
        print(
            f"Connecting to MySQL at {db_config['host']}:{db_config['port']} with user {db_config['user']}"
        )

        pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mypool", pool_size=5, **db_config
        )

        with pool.get_connection() as conn:
            print("Database connection successful")

        return pool

    except mysql.connector.Error as err:
        print(f"MySQL error: {err}")
        raise
    except Exception as e:
        print(f"Error creating database pool: {e}")
        raise
