from typing import Iterator

from groq import Groq

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """You are Solace, a compassionate AI mental wellness companion.
You provide emotional support and active listening.
You use evidence-based coping strategies.
You are warm and non-judgmental.
You never diagnose or prescribe.
You always encourage professional help when needed."""


def stream_chat(messages: list[dict[str, str]]) -> Iterator[str]:
    stream = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, *messages],
        stream=True,
        temperature=0.7,
        max_tokens=1024,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta
        if delta and delta.content:
            yield delta.content
