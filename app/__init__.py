from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import create_db_pool
from app.api.routers import attractions, mrts, static_pages, booking, user, orders

db_pool = create_db_pool(settings)


def create_app():
    app = FastAPI()

    app.mount("/static", StaticFiles(directory="app/static"), name="static")

    async def db_middleware(request, call_next):
        if request.url.path.startswith("/static"):
            return await call_next(request)
        request.state.db_pool = db_pool
        response = await call_next(request)
        return response

    app.middleware("http")(db_middleware)

    app.include_router(static_pages.router)
    app.include_router(attractions.router)
    app.include_router(mrts.router)
    app.include_router(booking.router)
    app.include_router(user.router)
    app.include_router(orders.router)

    return app


app = create_app()
