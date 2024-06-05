from fastapi import APIRouter, Request

router = APIRouter(
    prefix="/api",
    tags=["MRT Station"],
)


@router.get("/mrts")
async def 取得捷運站名稱列表(
    request: Request,
):
    """取得所有捷運站名稱列表，按照週邊景點的數量由大到小排序"""
    pass
