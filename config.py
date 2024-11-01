from pydantic_settings import BaseSettings
from dotenv import load_dotenv


class Settings(BaseSettings):
    # Database Setting
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_DATABASE: str
    DB_USER: str
    DB_PASSWORD: str

    # JWT Setting
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 30

    # Tappay Setting
    TAPPAY_SANDBOX_URL: str
    PARTNER_KEY: str
    MERCHANT_ID: str

    class Config:
        env_file = ".env"


load_dotenv()
settings = Settings()
