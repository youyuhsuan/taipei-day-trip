from fastapi.responses import JSONResponse
from typing import Optional
from model.user import UserCredentials
from utils.render_response import render_response


# POST
def format_signup_response(status: str) -> JSONResponse:
    if status == "match_email":
        return render_response(400, {"error": True, "message": "電子郵件已存在"})
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "伺服器內部錯誤"})
    else:
        return render_response(200, {"ok": True})


# GET
def format_user_response(
    credentials: Optional[UserCredentials] = None, status: Optional[str] = None
):
    if credentials:
        return credentials
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "伺服器內部錯誤"})
    else:
        return None


# PUT
def format_signin_response(
    status: Optional[str] = None, token: Optional[dict] = None
) -> JSONResponse:
    if status == "match_user":
        return render_response(400, {"error": True, "message": "查無符合條件的使用者"})
    elif status == "password_mismatch":
        return render_response(
            400, {"error": True, "message": "您的電子郵件和密碼不匹配，請重新一次"}
        )
    elif status == "server_error":
        return render_response(500, {"error": True, "message": "伺服器內部錯誤"})
    else:
        return render_response(200, {"token": token})
