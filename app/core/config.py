from pydantic_settings import BaseSettings
from dotenv import load_dotenv


class Settings(BaseSettings):
    # Database Setting
    # MYSQL_HOST: str = "mydb"
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_ROOT_PASSWORD: str

    # JWT Setting
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # Tappay Setting
    TAPPAY_SANDBOX_URL: str
    PARTNER_KEY: str
    MERCHANT_ID: str

    class Config:
        env_file = ".env"


load_dotenv()
settings = Settings()
