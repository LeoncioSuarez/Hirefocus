import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

AFFINDA_API_KEY = os.getenv("AFFINDA_API_KEY")
AFFINDA_API_URL = os.getenv("AFFINDA_API_URL", "https://api.affinda.com/v2/documents")


def parse_resume(file_path: str) -> dict:
    """Send a resume file to Affinda and return a normalized dict.
    If AFFINDA_API_KEY is not configured, this will return a minimal fallback parse.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError("Resume file not found: %s" % file_path)

    headers = {}
    if AFFINDA_API_KEY:
        headers["Authorization"] = f"Bearer {AFFINDA_API_KEY}"

    try:
        with open(file_path, "rb") as f:
            files = {"file": f}
            resp = requests.post(AFFINDA_API_URL, files=files, headers=headers, timeout=30)

        if resp.status_code not in (200, 201):
            logging.warning("Affinda parsing returned %s: %s", resp.status_code, resp.text)
            return _fallback_parse(file_path)

        data = resp.json()

        # Try to normalize the most useful fields based on common Affinda responses
        parsed = {
            "id": data.get("id") or data.get("document", {}).get("id"),
            "full_name": data.get("name") or data.get("full_name"),
            "email": _extract_email(data),
            "phone": _extract_phone(data),
            "skills": _extract_skills(data),
            "summary": data.get("summary") or None,
            "raw": data,
        }
        return parsed

    except Exception as exc:
        logging.exception("Error while parsing resume with Affinda: %s", exc)
        return _fallback_parse(file_path)


# Helper heuristics

def _fallback_parse(file_path: str) -> dict:
    base = os.path.basename(file_path)
    name_guess = os.path.splitext(base)[0]
    return {"id": None, "full_name": name_guess, "email": "", "phone": None, "skills": [], "summary": None, "raw": {}}


def _extract_email(data: dict) -> str | None:
    # Affinda often returns structured fields; try several paths
    if isinstance(data, dict):
        for key in ("email", "emails", "contact_email"):
            v = data.get(key)
            if v:
                if isinstance(v, list):
                    return v[0]
                return v
        # search in raw fields
        for v in (data.get("raw"), data.get("document")):
            if isinstance(v, dict):
                for key in ("email", "emails"):
                    if v.get(key):
                        return v.get(key)[0] if isinstance(v.get(key), list) else v.get(key)
    return None


def _extract_phone(data: dict) -> str | None:
    for key in ("phone", "phones", "telephone"):
        v = data.get(key)
        if v:
            if isinstance(v, list):
                return v[0]
            return v
    return None


def _extract_skills(data: dict) -> list:
    # Try common locations
    skills = []
    for key in ("skills", "keywords", "tags"):
        v = data.get(key)
        if v:
            if isinstance(v, list):
                skills.extend(v)
            elif isinstance(v, str):
                skills.extend([s.strip() for s in v.split(",") if s.strip()])
    return skills
