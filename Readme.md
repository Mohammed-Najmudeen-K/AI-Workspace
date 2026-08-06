# AI Workspace

AI Workspace is a full-stack AI assistant application that combines a conversational chat experience with document-based retrieval-augmented generation (RAG). It is built with a FastAPI backend and a React + Vite frontend, and it allows users to chat with an AI assistant while grounding answers in uploaded documents.

The project is designed as a practical prototype for building an AI knowledge workspace where users can:

- create and manage chat conversations
- stream assistant responses in real time
- upload documents to a knowledge base
- retrieve relevant document chunks for context-aware answers
- manage authentication and user sessions

## What the app does

The application works in three main layers:

1. Frontend experience
   - users interact with a chat UI and document management page
   - conversations, messages, uploads, and settings are handled in the React app

2. Backend API
   - FastAPI exposes routes for authentication, chat, conversations, documents, and streaming
   - requests are validated, processed, and responded to through dedicated services

3. AI and knowledge layer
   - user questions are embedded and matched against indexed document chunks using ChromaDB
   - retrieved context is passed to Gemini for answer generation
   - the system can answer general questions when no relevant document context is available

## Project flow

### 1. User opens the app

The user visits the frontend at http://localhost:5173 and lands on the chat experience. The UI loads existing conversations and provides access to the document library and settings panel.

### 2. User sends a message

When a user submits a chat message:

- the frontend sends the prompt to the backend chat endpoint
- the backend creates or loads the conversation
- the message is stored in the database
- the backend generates an embedding for the user question

### 3. Context retrieval

The backend searches the vector database (ChromaDB) for document chunks that are semantically similar to the query.

If relevant chunks are found:
- those chunks are used as context for answer generation
- the response is grounded in the uploaded documents

If no relevant context is found:
- the system can still provide a helpful general answer from the LLM
- this makes the assistant usable even outside the knowledge base

### 4. Answer generation

The retrieved context and the user question are passed to Gemini, which generates the final response.

The backend may also attach source references to the answer if the response came from indexed document content.

### 5. Conversation persistence

Conversations and messages are stored in SQLAlchemy-backed tables so the chat history remains available between sessions.

### 6. Document ingestion

When a document is uploaded:

- the file is saved to the backend upload folder
- text is extracted from the document
- content is split into smaller chunks
- embeddings are generated
- the chunks are indexed into ChromaDB for later retrieval

## Main features

- streaming chat responses with live UI updates
- conversation history and management
- document upload and deletion
- knowledge-base indexing and retrieval
- authentication and user account routes
- settings panel for chat and document actions

## Architecture overview

### Backend structure

- backend/app/api/: API routers for auth, chat, conversations, documents, and streaming
- backend/app/services/: business logic for chat, document processing, embeddings, and vector search
- backend/app/models/: SQLAlchemy models for users, conversations, messages, and documents
- backend/app/schemas/: Pydantic validation models for API input and output
- backend/app/database/: database connection and base setup
- backend/app/core/config.py: environment configuration loader

### Frontend structure

- frontend/src/pages/: chat and document pages
- frontend/src/components/: chat UI, sidebar, message bubbles, and navigation
- frontend/src/services/: API wrappers for chat and document routes
- frontend/src/context/: shared app state such as authentication or theme context
- frontend/src/styles/: styling and theme definitions

## Technology stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- ChromaDB
- Google Gemini API
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- CSS-based styling

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm
- Git

### 1. Backend setup

Open a terminal and go to the backend folder:

```bash
cd backend
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Create a .env file in the backend directory with the required variables:

```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_API_KEY=your-google-api-key
```

Start the backend server:

```bash
uvicorn app.main:app --reload --port 8014
```

Open the API docs here:

```text
http://127.0.0.1:8014/docs
```

### 2. Frontend setup

Open a second terminal and go to the frontend folder:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

## Environment and storage notes

- The frontend expects the backend at http://127.0.0.1:8014
- Uploaded files are stored under backend/app/uploads
- The vector database is stored under backend/app/chroma_db
- The application uses SQLite by default for local development

## Usage examples

- Ask a question about uploaded documents to trigger RAG-based answers
- Ask a general question outside the knowledge base to test the fallback assistant behavior
- Upload PDFs, text files, and other supported document types to build up the knowledge base
- Delete documents from the UI to remove them from storage and indexing

## Project roadmap and status

The project has progressed through several implementation stages covering core chat, document management, authentication, UI polish, and backend hardening.

### Completed phases

## Current Status

✅ Authentication

✅ Streaming Chat

✅ RAG

✅ ChromaDB

✅ Document Upload

✅ Conversation History

🚧 Voice Assistant (Planned)

🚧 Export Chat (Planned)

## License

This repository does not currently include an explicit license. Add one if you want to share or distribute the project publicly.
