import mysql.connector
from mysql.connector import errorcode


dbconfig = {
    "user": "root",
    "password": "23322907",
    "host": "localhost",
}


def create_connection_pool():
    cnxpool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="taipei_attractions", pool_size=3, **dbconfig
    )
    return cnxpool


def get_connection_pool(cnxpool):
    try:
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        print(cnx, cursor)
        return cnx, cursor
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)


def release_connection(cnx, cursor):
    cnx.close()
    cursor.close()


cnxpool = get_connection_pool(cnxpool)
