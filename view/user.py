from fastapi.responses import JSONResponse
from model.user import UserCredentials


def render_response(status_code: int, content: dict, error: bool = False):
    return JSONResponse(
        status_code=status_code, content=content, media_type="application/json"
    )


def signup_response(message: str):
    if message == "match_email":
        return render_response(400, {"error": True, "message": "電子郵件已存在"})
    elif message == "server_error":
        return render_response(500, {"error": True, "message": "伺服器內部錯誤"})
    else:
        return render_response(200, {"ok": True})


def user_response(credentials: UserCredentials | None, server_error: bool = False):
    if credentials:
        return credentials
    elif server_error:
        return render_response(500, {"error": True, "message": "伺服器內部錯誤"})
    else:
        return None


def signin_response(token: dict | None, message: str | None):
    if message == "match_user":
        return render_response(400, {"error": True, "message": "查無符合條件的使用者"})
    elif message == "password_mismatch":
        return render_response(
            400, {"error": True, "message": "您的電子郵件和密碼不匹配，請重新一次"}
        )
    elif message == "server_error":
        return render_response(500, {"error": True, "message": "伺服器內部錯誤"})
    else:
        return {"token": token}
