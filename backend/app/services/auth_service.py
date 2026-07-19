from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.auth.password import hash_password


class AuthService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def register(self, name, email, password):

        existing = self.repository.get_by_email(email)

        if existing:
            raise Exception("Email already exists")

        user = User(
            name=name,
            email=email,
            password=hash_password(password)
        )

        return self.repository.create(user)