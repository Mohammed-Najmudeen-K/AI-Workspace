from app.auth.password import hash_password, verify_password
from app.core.security import create_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository


class AuthService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def register(self, name: str, email: str, password: str):
        existing = self.repository.get_by_email(email)

        if existing:
            raise Exception("Email already exists")

        user = User(
            name=name,
            email=email,
            password=hash_password(password)
        )

        return self.repository.create(user)

    def login(self, email: str, password: str):
        user = self.repository.get_by_email(email)

        if not user:
            raise Exception("Invalid credentials")

        if not verify_password(password, user.password):
            raise Exception("Invalid credentials")

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }