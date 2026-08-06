from pathlib import Path
content = '''import logging
import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import chat_stream, document
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.conversation import router as conversation_router
from app.api.users import router as user_router
from app.database.database import Base, engine
from app.models import conversation, message  # noqa: F401

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("ai_workspace")

app = FastAPI(
    title="AI Workspace API",
    description="API for chat, conversation management, and document ingestion in the AI workspace app.",
    version="1.0.0",
    openapi_tags=[
        {"name": "AI Chat", "description": "Send and stream chat responses."},
        {"name": "Conversations", "description": "Create, list, rename, and delete conversations."},
        {"name": "Documents", "description": "Upload, list, and remove documents from the knowledge base."},
        {"name": "Auth", "description": "Authentication and user identity operations."},
        {"name": "Users", "description": "User account management endpoints."},
    ],
)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    started = time.perf_counter()

    try:
        response = await call_next(request)
    except Exception as exc:
        logger.exception("Unhandled exception for %s %s", request.method, request.url.path)
        raise exc

    duration = time.perf_counter() - started
    logger.info("%s %s completed with status %s in %.3fs", request.method, request.url.path, response.status_code, duration)
    return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning("Validation error for %s %s: %s", request.method, request.url.path, exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors(), "message": "Invalid request payload"})


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception for %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


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
'''
Path('d:/AI Workspace/backend/app/main.py').write_text(content)
print('updated')
