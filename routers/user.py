from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Annotated
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
import os


SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_DAYS = 7

router = APIRouter()


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            print(credentials)
            if not credentials.scheme == "Bearer":
                return None
            if not self.verify_jwt(credentials.credentials):
                return None
            return credentials.credentials
        else:
            return None

    def verify_jwt(self, jwt_token: str) -> bool:
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload["exp"] >= datetime.now(timezone.utc).timestamp()
        except:
            return False


class User(BaseModel):
    email: Annotated[EmailStr, Field(description="The user's email")]
    password: Annotated[str, Field(description="The user's password")]


class UserAuth(User):
    name: Annotated[str, Field(description="The user's name")]


class Token(BaseModel):
    token: str


def create_access_token(data: dict):
    expires_delta = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    expire = datetime.now(timezone.utc) + expires_delta
    data.update({"exp": expire})
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        current_time = datetime.now(timezone.utc).timestamp()
        expiration_time = decoded_token.get("exp", 0)
        if expiration_time >= current_time:
            return decoded_token
        else:
            return None
    except:
        return None


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


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
                    content = {
                        "error": True,
                        "message": "Email already exists",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
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
                    data = {"ok": True}
                    return JSONResponse(content=data, media_type="application/json")
    except Exception as e:
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


@router.get("/api/user/auth", tags=["User"])
async def get_current_user(token: str = Depends(JWTBearer())):
    if token:
        try:
            credentials = decodeJWT(token)
            credentials = {
                "data": {
                    "id": credentials.get("id"),
                    "name": credentials.get("name"),
                    "email": credentials.get("email"),
                }
            }
            return credentials
        except Exception as e:
            return None


@router.put("/api/user/auth", tags=["User"])
async def put_user_auth(request: Request, User: User):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                email = User.email
                password = User.password
                query = "SELECT id, name, email, password FROM users WHERE email = %s;"
                cursor.execute(query, (email,))
                match_user = cursor.fetchone()
                if not match_user:
                    content = {
                        "error": True,
                        "message": "查無符合條件的使用者",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
                elif not verify_password(password, match_user["password"]):
                    content = {
                        "error": True,
                        "message": "您的電子郵件和密碼不匹配，請重新一次",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )

                token = create_access_token(
                    data={
                        "id": match_user["id"],
                        "name": match_user["name"],
                        "email": match_user["email"],
                    },
                )
                return JSONResponse(
                    status_code=200,
                    content={"token": token},
                    media_type="application/json",
                )
    except Exception as e:
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )
