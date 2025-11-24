import os, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if root not in sys.path:
    sys.path.insert(0, root)

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

print('GET /users/')
resp = client.get('/users/')
print(resp.status_code)
print(resp.json())

print('\nGET /jobs/')
resp = client.get('/jobs/')
print(resp.status_code)
print(resp.json())

print('\nAttempt POST /applications/ with user_id=1 job_id=3')
payload = {"user_id": 1, "job_id": 3, "cv": "Texto de prueba"}
resp = client.post('/applications/', json=payload)
print('status', resp.status_code)
try:
    print(resp.json())
except Exception:
    print('No JSON body')

# If 500, print server exception info (TestClient exposes .text)
print('\nRaw body:')
print(resp.text)
