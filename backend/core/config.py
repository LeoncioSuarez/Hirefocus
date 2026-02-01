from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    STREAM_API_KEY: str | None = None
    STREAM_API_SECRET: str | None = None
    AFFINDA_API_KEY: str | None = None
    AFFINDA_API_URL: str | None = None
    NYLAS_ACCESS_TOKEN: str | None = None
    NYLAS_API_BASE: str | None = "https://api.nylas.com"

    class Config:
        env_file = ".env"


settings = Settings()
