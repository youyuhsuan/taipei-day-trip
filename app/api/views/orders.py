from typing import Optional
from fastapi.responses import JSONResponse
from ..utils.render_response import render_response
from ..schemas.schemas import OrderResponse


# POST
def format_create_order_response(
    status: Optional[str] = None, data: Optional[dict] = None
) -> JSONResponse:
    if status == "invalid_booking":
        return render_response(
            400, {"error": True, "message": "Matching booking not found"}
        )
    elif status == "payment_failure":
        return render_response(400, {"data": data})
    elif status == "unauthorized":
        return render_response(403, {"error": True, "message": "Unauthorized access"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    else:
        return render_response(200, {"data": data})


# GET
def format_get_order_by_number_response(
    status: Optional[str] = None, data: Optional[OrderResponse] = None
) -> JSONResponse:
    if status == "order_not_found":
        return render_response(400, {"error": True, "message": "Order not found"})
    elif status == "unauthorized":
        return render_response(403, {"error": True, "message": "Unauthorized access"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "Internal server error"})
    else:
        return render_response(200, {"data": data})


def format_payment_response(status: Optional[str] = None, data: Optional[dict] = None):
    if status == "server_error":
        return render_response(500, {"error": True, "message": data})
    return data
