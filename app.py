from fastapi import *
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from config import settings
import mysql.connector.pooling
from routers import attractions, mrts, static_pages, booking, user, orders


app = FastAPI()


db_config = {
    "host": settings.DB_HOST,
    "port": settings.DB_PORT,
    "database": settings.DB_DATABASE,
    "user": settings.DB_USER,
    "password": settings.DB_PASSWORD,
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool", pool_size=5, **db_config
)


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.middleware("http")
async def attach_db_connection(request: Request, call_next):
    request.state.db_pool = cnxpool
    response = await call_next(request)
    return response


# @app.exception_handler(booking.CustomHTTPException)
# async def custom_http_exception_handler(
#     request: Request, exc: booking.CustomHTTPException
# ):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"error": exc.error, "message": exc.message},
#     )


router = APIRouter()

app.include_router(static_pages.router)
app.include_router(attractions.router)
app.include_router(mrts.router)
app.include_router(booking.router)
app.include_router(user.router)
app.include_router(orders.router)
