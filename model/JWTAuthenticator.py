from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from datetime import datetime, timezone
from passlib.context import CryptContext
import jwt
from config import settings

# Config
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_DAYS = settings.ACCESS_TOKEN_EXPIRE_DAYS


class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, error: bool, message: str):
        super().__init__(
            status_code=status_code, detail={"error": error, "message": message}
        )
        self.error = error
        self.message = message


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if credentials.scheme != "Bearer":
                raise CustomHTTPException(
                    status_code=403, error=True, message="Invalid authentication scheme"
                )
            if not self.verify_jwt(credentials.credentials):
                raise CustomHTTPException(
                    status_code=403,
                    error=True,
                    message="Invalid token or expired token",
                )
            return credentials.credentials
        else:
            raise CustomHTTPException(
                status_code=403, error=True, message="Invalid authorization code"
            )

    def verify_jwt(self, jwt_token: str) -> bool:
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload["exp"] >= datetime.now(timezone.utc).timestamp()
        except:
            return False


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
