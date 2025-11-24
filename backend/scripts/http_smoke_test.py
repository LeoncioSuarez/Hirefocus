import os, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if root not in sys.path:
    sys.path.insert(0, root)

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

print('== GET /openapi.json ==')
resp = client.get('/openapi.json')
print(resp.status_code)
print(resp.json().get('info', {}))

print('\n== GET /users/ (before) ==')
resp = client.get('/users/')
print(resp.status_code)
print(resp.json())

print('\n== POST /users/ ==')
user_payload = {"username": "tc_user", "email": "tc@example.com", "password": "Secret123!"}
resp = client.post('/users/', json=user_payload)
print(resp.status_code)
print(resp.json())

print('\n== GET /users/ (after) ==')
resp = client.get('/users/')
print(resp.status_code)
print(resp.json())

print('\n== POST /jobs/ ==')
job_payload = {"title": "TC Job", "description": "Test job", "required_skills": "Python"}
resp = client.post('/jobs/', json=job_payload)
print(resp.status_code)
job = resp.json()
print(job)

print('\n== POST /applications/ ==')
app_payload = {"user_id": user_payload.get('username') and (resp := None) and 0}
# we'll retrieve correct ids
users = client.get('/users/').json()
jobs = client.get('/jobs/').json()
if users and jobs:
    user_id = users[-1]['id']
    job_id = jobs[-1]['id']
    app_payload = {"user_id": user_id, "job_id": job_id, "cv": "Test CV"}
    resp = client.post('/applications/', json=app_payload)
    print(resp.status_code)
    print(resp.json())

    print('\n== GET /jobs/{id} ==')
    resp = client.get(f'/jobs/{job_id}')
    print(resp.status_code)
    print(resp.json())
else:
    print('No users or jobs found, skipping application test')
