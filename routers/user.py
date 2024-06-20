from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Annotated
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from jwt.exceptions import InvalidTokenError, InvalidTokenError
import os


SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

router = APIRouter()


class User(BaseModel):
    email: Annotated[EmailStr, Field(description="The user's email")]
    password: Annotated[str, Field(description="The user's password")]


class UserAuth(User):
    name: Annotated[str, Field(description="The user's name")]


class Token(BaseModel):
    token: str


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
                # raise HTTPException(
                #     status_code=403, detail="Invalid authentication scheme."
                # )
            if not self.verify_jwt(credentials.credentials):
                return None
                # raise HTTPException(
                #     status_code=403, detail="Invalid token or expired token."
                # )
            return credentials.credentials
        else:
            return None
            # raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwt_token: str) -> bool:
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload["exp"] >= datetime.now(timezone.utc).timestamp()
        except:
            return False

    def decodeJWT(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return (
                payload
                if payload["exp"] >= datetime.now(timezone.utc).timestamp()
                else None
            )
        except:
            return None


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


class TokenData(BaseModel):
    id: Annotated[int, Field(description="The user's name")]
    name: Annotated[str, Field(description="The user's name")]
    email: Annotated[EmailStr, Field(description="The user's email")]
    exp: Annotated[int, Field(description="JWT expiration time in Unix timestamp")]


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
                name = UserAuth.name
                email = UserAuth.email
                password = UserAuth.password
                query = "SELECT email FROM user WHERE email = %s"
                cursor.execute(query, (email,))
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
                        "INSERT INTO user(name,email,password) VALUES (%s, %s, %s)"
                    )
                    cursor.execute(
                        insert_new_account,
                        (
                            name,
                            email,
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        payload_data = {
            "data": {
                "id": payload.get("id"),
                "name": payload.get("name"),
                "email": payload.get("email"),
            }
        }
        return payload_data
    except InvalidTokenError as e:
        return JSONResponse(status_code=401, detail="Invalid token or expired token.")


@router.put("/api/user/auth", tags=["User"])
async def put_user_auth(request: Request, User: User):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                email = User.email
                password = User.password
                query = "SELECT id, name, email, password FROM user WHERE email = %s;"
                cursor.execute(query, (email,))
                match_user = cursor.fetchone()
                if not match_user or not verify_password(
                    password, match_user["password"]
                ):
                    content = {
                        "error": True,
                        "message": "您的電子郵件和密碼不匹配，請重新一次",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
                access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                access_token = create_access_token(
                    data={
                        "id": match_user["id"],
                        "name": match_user["name"],
                        "email": match_user["email"],
                    },
                    expires_delta=access_token_expires,
                )
                return JSONResponse(
                    status_code=200,
                    content={"token_type": "bearer", "token": access_token},
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
