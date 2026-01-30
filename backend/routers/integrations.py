from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

try:
    from backend.db.database import get_db
    from backend.models.users import User
    from backend.services import stream_service
except ModuleNotFoundError:
    from db.database import get_db
    from models.users import User
    from services import stream_service

# Authentication dependencies would normally go here
# For now, we will assume a simple user_id is passed or simulate current user

router = APIRouter(
    prefix="/integrations/stream",
    tags=["integrations"]
)

@router.post("/token")
async def get_stream_token(user_id: str, name: str, db: AsyncSession = Depends(get_db)):
    """
    Generate a Stream Chat token for the user.
    Ideally this endpoint is protected and user_id comes from the auth token.
    For this demo, we accept user_id and name to upsert and generate token.
    """
    try:
        # Upsert user to Stream (ensure they exist)
        stream_service.upsert_user(user_id, name)
        
        # Generate token
        token = stream_service.create_token(user_id)
        
        return {
            "api_key": stream_service.STREAM_API_KEY,
            "token": token,
            "user_id": user_id,
            "user_name": name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
