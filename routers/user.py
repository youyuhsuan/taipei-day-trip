from fastapi import APIRouter, Request, Depends

from model.user import JWTBearer, UserAuth, User
from controller.user import (
    create_access_token,
    decodeJWT,
    get_password_hash,
    verify_password,
)
from view.user import (
    signup_response,
    user_response,
    signin_response,
)


router = APIRouter()


@router.post("/api/user", tags=["User"])
async def signup(request: Request, UserAuth: UserAuth):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                password = UserAuth.password
                query = "SELECT email FROM users WHERE email = %s"
                cursor.execute(query, (UserAuth.email,))
                match_email = cursor.fetchone()
                if match_email:
                    return signup_response(match_email)
                else:
                    hashed_password = get_password_hash(password)
                    insert_new_account = (
                        "INSERT INTO users(name,email,password) VALUES (%s, %s, %s)"
                    )
                    cursor.execute(
                        insert_new_account,
                        (
                            UserAuth.name,
                            UserAuth.email,
                            hashed_password,
                        ),
                    )
                    con.commit()
                    return signup_response("success")
    except Exception as e:
        print(f"Signup error:{e}")
        return signup_response("server_error")


@router.get("/api/user/auth", tags=["User"])
async def get_current_user(token: str = Depends(JWTBearer())):
    try:
        if not token:
            return user_response(None)
        credentials = decodeJWT(token)
        credentials = {
            "data": {
                "id": credentials.get("id"),
                "name": credentials.get("name"),
                "email": credentials.get("email"),
            }
        }
        return user_response(credentials)
    except Exception as e:
        print(f"Get current user error:{e}")
        return user_response("server_error")


@router.put("/api/user/auth", tags=["User"])
async def signin(request: Request, user: User):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT id, name, email, password FROM users WHERE email = %s;"
                cursor.execute(query, (user.email,))
                match_user = cursor.fetchone()
                if not match_user:
                    return signin_response(None, "match_user")
                if not verify_password(user.password, match_user["password"]):
                    return signin_response(None, "password_mismatch")
                token = create_access_token(
                    data={
                        "id": match_user["id"],
                        "name": match_user["name"],
                        "email": match_user["email"],
                    },
                )
                return signin_response(token, None)
    except Exception as e:
        print(f"Signin error: {e}")
        return signin_response(None, "server_error")
