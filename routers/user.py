from typing import Annotated, Union
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


router = APIRouter()


class User(BaseModel):
    id: Union[int, None] = None
    name: Union[str, None] = None
    email: EmailStr


class UserInDB(User):
    password: Union[str, None] = None


def get_password_hash(plain_password: str):
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/api/user")
async def signup(request: Request, name: str, email: EmailStr, password: str):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                user = UserInDB(name=name, email=email, password=password)
                query = "SELECT email FROM user WHERE email = %s"
                cursor.execute(query, (user.email,))
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
                    hashed_password = get_password_hash(user.password)
                    insert_new_account = (
                        "INSERT INTO user(name,email,password) VALUES (%s, %s, %s)"
                    )
                    cursor.execute(
                        insert_new_account,
                        (
                            user.name,
                            user.email,
                            hashed_password,
                        ),
                    )
                    con.commit()
                    data = {"ok": True}
                    return JSONResponse(content=data, media_type="application/json")
    except Exception as e:
        print(e)
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


@router.get("/api/user/auth")
async def signup(request: Request, email: EmailStr, password: str):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connection() as con:
            with con.cursor(dictionary=True) as cursor:
                query = "SELECT id, name, email, password FROM user WHERE email = %s;"
                cursor.execute(query, (email,))
                match_user = cursor.fetchone()
                if match_user:
                    if verify_password(password, match_user["password"]):
                        # user = User(
                        #     id=match_user["id"],
                        #     name=match_user["name"],
                        #     email=match_user["email"],
                        # )
                        # print(user)
                        data = {
                            "id": match_user["id"],
                            "name": match_user["name"],
                            "email": match_user["email"],
                        }
                        return {"data": data}
                    else:
                        content = {
                            "error": True,
                            "message": "Invalid password",
                        }
                        return JSONResponse(
                            status_code=400,
                            content=content,
                            media_type="application/json",
                        )
                else:
                    content = {
                        "error": True,
                        "message": "Invalid email",
                    }
                    return JSONResponse(
                        status_code=400,
                        content=content,
                        media_type="application/json",
                    )
    except Exception as e:
        print(e)
        content = {
            "error": True,
            "message": "Internal server error",
        }
        return JSONResponse(
            status_code=500,
            content=content,
            media_type="application/json",
        )


@router.put("/api/user/auth", response_model=User)
async def signup(request: Request, token: Annotated[str, Depends(oauth2_scheme)]):
    db_pool = request.state.db_pool
    try:
        with db_pool.get_connect() as con:
            with con.cursor(dictionary=True) as cursor:
                print(token)
                return {"token": token}
    except Exception as e:
        pass


def fake_decode_token(token):
    return User(
        username=token + "fakedecoded", email="john@example.com", full_name="John Doe"
    )


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    return user
