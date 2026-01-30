import os
import logging
from stream_chat import StreamChat
from dotenv import load_dotenv

load_dotenv()

STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

if not STREAM_API_KEY or not STREAM_API_SECRET:
    logging.warning("Stream Chat API Key or Secret not found in environment variables.")

# Initialize global client
# In production, you might want to initialize this lazily or as a dependency
try:
    stream_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)
except Exception as e:
    logging.error(f"Failed to initialize Stream Chat client: {e}")
    stream_client = None

def create_token(user_id: str):
    """
    Generate a Stream Chat token for the given user_id.
    """
    if not stream_client:
        raise ValueError("Stream Client is not initialized correctly.")
    
    # Token usually doesn't expire by default unless exp is set
    token = stream_client.create_token(user_id)
    return token

def upsert_user(user_id: str, name: str, image_url: str = None, role: str = 'user'):
    """
    Upsert a user in Stream Chat to ensure they exist and have correct details.
    """
    if not stream_client:
        return None
    
    user_data = {
        "id": user_id,
        "name": name,
        "role": role
    }
    if image_url:
        user_data["image"] = image_url
        
    return stream_client.upsert_user(user_data)
