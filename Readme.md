# AI Workspace

AI Workspace is a full-stack proof-of-concept chat and knowledge base application built with a FastAPI backend and a React frontend.

The app supports streaming AI responses, document upload and retrieval-augmented generation (RAG), and a modern conversational interface.

## Key Features

- FastAPI backend with REST and streaming chat endpoints
- React frontend with conversation history, chat UI, and document management
- Document upload, parsing, chunking, embedding, and storage
- RAG-powered responses using ChromaDB and Google Gemini
- Streaming assistant output with live UI updates and cancel/stop support
- SQLAlchemy persistence for conversations, messages, and documents
- Authentication API endpoints for register and login

## Architecture

- `backend/`: Python FastAPI application
  - `app/api/`: API routers for auth, chat, conversations, documents, and streaming
  - `app/services/`: Business logic for chat, document ingestion, embeddings, and vector search
  - `app/models/`: SQLAlchemy models for conversations, messages, documents, and chunks
  - `app/schemas/`: Pydantic request/response schemas
  - `app/database/`: database session and base model
  - `app/core/config.py`: configuration loader from `.env`

- `frontend/`: React + Vite application
  - `src/pages/`: Chat and Documents pages
  - `src/components/`: UI components for chat, sidebar, and messages
  - `src/services/`: API wrappers for chat and document endpoints
  - `src/index.css`: application styling

## Getting Started

### Prerequisites

- Python 3.11+ (or compatible Python 3.x)
- Node.js 18+ and npm
- Git

### Backend setup

1. Open a terminal and change into the backend folder:

```bash
cd backend
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in `backend/` and add the required variables:

```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_API_KEY=your-google-api-key
```

4. Start the backend server:

```bash
uvicorn app.main:app --reload --port 8014
```

5. Open the API docs in your browser:

```text
http://127.0.0.1:8014/docs
```

### Frontend setup

1. Open a new terminal and change into the frontend folder:

```bash
cd frontend
```

2. Install Node dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

4. Open the frontend app in your browser:

```text
http://localhost:5173
```

## Usage

- Use the chat interface to send messages to the AI assistant.
- The assistant response is streamed back in real time from `/chat/stream`.
- Upload documents from the Documents page to index files and enable retrieval.
- Delete uploaded documents from the document list.

## Notes

- The frontend expects the backend API to be available at `http://127.0.0.1:8014`.
- Document upload uses multipart form data and persists files under `backend/app/uploads`.
- The vector database is stored in `backend/app/chroma_db`.
- The current UI flow centers on a single assistant chat experience; multi-agent orchestration is not currently exposed in the main UI.

## Project Status

This project is under active development and acts as a prototype for an AI-assisted knowledge workspace.

## License

This repository does not currently include an explicit license. Add one if you want to share or distribute the project publicly.
