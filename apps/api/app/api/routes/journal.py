from fastapi import APIRouter
from pydantic import BaseModel

from app.services.groq_service import client

router = APIRouter(prefix="/journal", tags=["journal"])


class AnalyzeRequest(BaseModel):
    content: str


@router.post("/analyze")
async def analyze_journal(req: AnalyzeRequest):
    # Sentiment analysis
    sentiment_response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a sentiment analysis AI. 
                Analyze the emotional tone of the journal entry.
                Respond with ONLY one word: positive, neutral, or negative.
                Nothing else."""
            },
            {"role": "user", "content": req.content}
        ],
        max_tokens=10,
        temperature=0.1,
    )

    sentiment_raw = sentiment_response.choices[0].message.content.strip().lower()
    if "positive" in sentiment_raw:
        sentiment = "positive"
    elif "negative" in sentiment_raw:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    # Reflection prompt
    reflection_response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are Solace, a compassionate AI mental wellness companion.
                After reading someone's journal entry, provide a warm, thoughtful reflection.
                Ask one meaningful follow-up question to encourage deeper self-exploration.
                Keep it to 2-3 sentences max. Be empathetic and non-judgmental."""
            },
            {"role": "user", "content": f"Journal entry: {req.content}"}
        ],
        max_tokens=150,
        temperature=0.7,
    )

    reflection = reflection_response.choices[0].message.content.strip()

    return {
        "sentiment": sentiment,
        "reflection": reflection
    }
