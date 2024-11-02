from fastapi import APIRouter, Request, Depends
from models.user import JWTBearer, UserAuth, User
from views.user import (
    format_signup_response,
    format_user_response,
    format_signin_response,
)
from controllers.user import (
    create_access_token,
    decodeJWT,
    get_password_hash,
    verify_password,
)

router = APIRouter()


@router.post(
    "/api/user",
    tags=["User"],
    responses={
        200: {
            "model": format_signup_response,
            "description": "Registration successful",
            "content": {
                "application/json": {
                    "example": {
                        "ok": True,
                    }
                }
            },
        },
        400: {
            "model": format_signup_response,
            "description": "Registration failed, email already exists",
            "content": {
                "application/json": {
                    "examples": {
                        "match_email": {
                            "summary": "Email already exists",
                            "value": {"error": True, "message": "Email already exists"},
                        }
                    }
                }
            },
        },
        500: {
            "model": format_signup_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {
                        "error": True,
                        "message": "Internal server error",
                    }
                }
            },
        },
    },
)
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
                    return format_signup_response(status="match_email")
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
                    return format_signup_response()
    except Exception as e:
        print(f"Error in Signup error:{e}")
        return format_signup_response(status="server_error")


@router.get(
    "/api/user/auth",
    tags=["User"],
    responses={
        200: {
            "model": format_user_response,
            "description": "Current user's data, null if not logged in",
            "content": {
                "application/json": {
                    "example": {
                        "credentials": {"id": 0, "name": "string", "email": "string"},
                    }
                }
            },
        },
        500: {
            "model": format_user_response,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {
                        "error": True,
                        "message": "Internal server error",
                    }
                }
            },
        },
    },
)
async def get_current_user(token: str = Depends(JWTBearer())):
    try:
        if not token:
            return format_user_response(None)
        credentials = decodeJWT(token)
        credentials = {
            "data": {
                "id": credentials.get("id"),
                "name": credentials.get("name"),
                "email": credentials.get("email"),
            }
        }
        return format_user_response(credentials=credentials)
    except Exception as e:
        print(f"Error in getting current user error:{e}")
        return format_user_response(status="server_error")


@router.put(
    "/api/user/auth",
    tags=["User"],
    responses={
        200: {
            "model": format_signin_response,
            "description": "Login successful. JWT token issued with 7-day validity",
            "content": {
                "application/json": {
                    "example": {
                        "token": "",
                    }
                }
            },
        },
        400: {
            "model": format_signin_response,
            "description": "Login failed. Invalid email, password or other errors",
            "content": {
                "application/json": {
                    "examples": {
                        "user_not_found": {
                            "summary": "User not found",
                            "value": {"error": True, "message": "User not found"},
                        },
                        "password_mismatch": {
                            "summary": "Invalid credentials",
                            "value": {
                                "error": True,
                                "message": "Invalid email or password",
                            },
                        },
                    }
                }
            },
        },
        500: {
            "model": format_signin_response,
            "description": "Server error",
            "content": {
                "application/json": {
                    "example": {
                        "error": True,
                        "message": "Internal server error",
                    }
                }
            },
        },
    },
)
async def signin(request: Request, user: User):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT id, name, email, password FROM users WHERE email = %s;"
                cursor.execute(query, (user.email,))
                match_user = cursor.fetchone()
                if not match_user:
                    return format_signin_response(status="match_user")
                if not verify_password(user.password, match_user["password"]):
                    return format_signin_response(status="password_mismatch")
                token = create_access_token(
                    data={
                        "id": match_user["id"],
                        "name": match_user["name"],
                        "email": match_user["email"],
                    },
                )
                return format_signin_response(token=token)
    except Exception as e:
        print(f"Error in Signin: {e}")
        return format_signin_response(status="server_error")
