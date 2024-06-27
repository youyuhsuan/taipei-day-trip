from fastapi import *
from fastapi.responses import JSONResponse
from routers import attractions, mrts, static_pages, booking, user
from fastapi.staticfiles import StaticFiles
import mysql.connector.pooling
import os

app = FastAPI()

# dbconfig = {
#     "database": "taipei_attractions",
#     "user": "root",
#     "password": "betty520",
# }


SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_DAYS = 7


dbconfig = {
    # "host": os.environ["DB_HOST"],
    # "port": os.environ["DB_PORT"],
    "database": os.environ["DB_DATABASE"],
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
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


@app.exception_handler(booking.CustomHTTPException)
async def custom_http_exception_handler(
    request: Request, exc: booking.CustomHTTPException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error, "message": exc.message},
    )


router = APIRouter()

app.include_router(attractions.router)
app.include_router(mrts.router)
app.include_router(static_pages.router)
app.include_router(booking.router)
app.include_router(user.router)
