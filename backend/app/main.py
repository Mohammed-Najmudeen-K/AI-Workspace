from fastapi import FastAPI

app = FastAPI(
    title="AI Workspace API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Workspace API Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }