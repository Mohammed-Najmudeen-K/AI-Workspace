from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.conversation import router as conversation_router
from app.api.users import router as user_router
from app.database.database import Base, engine
from app.models import conversation, message  # noqa: F401
from app.api import document
from app.api import chat_stream

app = FastAPI()


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)

app.include_router(document.router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(conversation_router)
app.include_router(chat_stream.router)
app.include_router(chat_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)