from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./app/static/index.html", media_type="text/html")


@router.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
    return FileResponse("./app/static/attraction.html", media_type="text/html")


@router.get("/booking", include_in_schema=False)
async def booking(request: Request):
    return FileResponse("./app/static/booking.html", media_type="text/html")


@router.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
    return FileResponse("./app/static/thankyou.html", media_type="text/html")
