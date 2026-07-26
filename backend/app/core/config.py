import os
from pathlib import Path


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


def _load_env_file(path: Path):
    values = {}
    if not path.exists():
        return values

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


ENV_VALUES = _load_env_file(ENV_FILE)


class Settings:
    def __init__(self):
        self.PROJECT_NAME = ENV_VALUES.get("PROJECT_NAME", "AI Workspace")
        self.DATABASE_URL = ENV_VALUES.get("DATABASE_URL", "sqlite:///./test.db")
        self.SECRET_KEY = ENV_VALUES.get("SECRET_KEY", "test-secret-key")
        self.ALGORITHM = ENV_VALUES.get("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(ENV_VALUES.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.GOOGLE_API_KEY = ENV_VALUES.get("GOOGLE_API_KEY", "dummy")


settings = Settings()
