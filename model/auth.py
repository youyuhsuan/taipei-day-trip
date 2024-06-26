from datetime import datetime, timezone
from fastapi import Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt


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
