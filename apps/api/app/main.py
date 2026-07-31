from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.chat import router as chat_router
from app.api.routes.journal import router as journal_router

app = FastAPI(
    title="Solace API",
    description="AI-powered Mental Wellness Companion API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/v1")
app.include_router(journal_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Solace API 🧠", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "ok"}
