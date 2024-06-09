from fastapi import *
from routers import attractions, mrts, static_pages, booking
from fastapi.staticfiles import StaticFiles
import mysql.connector.pooling
import os

app = FastAPI()

dbconfig = {
    "host": os.environ["DB_HOST"],
    "port": os.environ["DB_PORT"],
    "database": os.environ["DB_database"],
    "user": os.environ["DB_USER"],
    "password": os.environ["MYSQL_PASSWORD"],
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool", pool_size=5, **dbconfig
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.middleware("http")
async def attach_db_connection(request: Request, call_next):
    request.state.db_pool = cnxpool
    response = await call_next(request)
    return response


router = APIRouter()

app.include_router(attractions.router)
app.include_router(mrts.router)
app.include_router(static_pages.router)
app.include_router(booking.router)
