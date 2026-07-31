from typing import AsyncIterator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.groq_service import stream_chat

router = APIRouter(prefix="/chat", tags=["chat"])


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


@router.post("/")
async def chat(request: ChatRequest) -> StreamingResponse:
    async def generate() -> AsyncIterator[str]:
        for chunk in stream_chat([m.model_dump() for m in request.messages]):
            yield f"data: {chunk}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
