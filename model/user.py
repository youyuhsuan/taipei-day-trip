from datetime import datetime, timezone
from fastapi import Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Annotated
import jwt
from config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = False):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
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


class UserCredentials(BaseModel):
    id: int
    name: str
    email: str
