import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

NYLAS_ACCESS_TOKEN = os.getenv("NYLAS_ACCESS_TOKEN")
NYLAS_API_BASE = os.getenv("NYLAS_API_BASE", "https://api.nylas.com")

HEADERS = {"Content-Type": "application/json"}
if NYLAS_ACCESS_TOKEN:
    HEADERS["Authorization"] = f"Bearer {NYLAS_ACCESS_TOKEN}"


def get_availability(email: str, start: str | None = None, end: str | None = None) -> list:
    """Return availability windows for a user's calendar.
    This function expects a valid NYLAS_ACCESS_TOKEN in env. It will raise if missing.
    """
    if not NYLAS_ACCESS_TOKEN:
        raise RuntimeError("NYLAS_ACCESS_TOKEN is not configured")

    url = f"{NYLAS_API_BASE}/free/busy"
    payload = {"emails": [email]}
    if start:
        payload["start_time"] = start
    if end:
        payload["end_time"] = end

    resp = requests.post(url, json=payload, headers=HEADERS, timeout=20)
    if resp.status_code != 200:
        logging.warning("Nylas availability returned %s: %s", resp.status_code, resp.text)
        raise RuntimeError("Failed to fetch availability from Nylas")

    return resp.json()


def create_event(event_payload: dict) -> dict:
    """Create a calendar event via Nylas v2 API. Requires NYLAS_ACCESS_TOKEN."""
    if not NYLAS_ACCESS_TOKEN:
        raise RuntimeError("NYLAS_ACCESS_TOKEN is not configured")

    url = f"{NYLAS_API_BASE}/events"
    resp = requests.post(url, json=event_payload, headers=HEADERS, timeout=20)
    if resp.status_code not in (200, 201):
        logging.warning("Nylas create event returned %s: %s", resp.status_code, resp.text)
        raise RuntimeError("Failed to create event in Nylas")

    return resp.json()
