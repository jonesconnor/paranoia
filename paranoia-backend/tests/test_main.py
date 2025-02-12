"""
Test cases for the ParaNoia application backend.

This module contains test cases for various endpoints of the ParaNoia application backend.
It includes tests for creating secrets, retrieving secrets, and handling multiple accesses.
The tests use helper functions for setting up and interacting with the test database,
making API calls, and asserting expected outcomes.
"""
from app.main import app
from fastapi.testclient import TestClient
from tests.utils import (
    create_test_secret,
    create_test_secret_with_multiple_accesses,
    assert_secret_not_found,
    assert_valid_secret_response,
    make_api_call,
    assert_valid_create_response,
    generate_uuid_payload
)

client = TestClient(app)

def test_read_hello_world():
    """
    Tests the root endpoint and ensure 200 status code.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_get_secret_success(test_db):
    """
    Tests the get_secret endpoint to ensure it successfully retrieves a stored secret.
    """
    secret = create_test_secret(test_db)
    response = make_api_call(client, f"/getsecret/{secret.uuid}")
    assert_valid_secret_response(response, secret.secret)

def test_multiple_secret_accesses(test_db):
    """
    Tests the get_secret endpoint to ensure it allows multiple accesses to a secret
    and correctly handles the remaining accesses.
    """
    secret = create_test_secret_with_multiple_accesses(test_db, remaining_accesses=3)
    for _ in range(3):
        response = make_api_call(client, f"/getsecret/{secret.uuid}")
        assert_valid_secret_response(response, secret.secret)
    response = make_api_call(client, f"/getsecret/{secret.uuid}")
    assert_secret_not_found(response)

def test_create_secret_generates_valid_uuid():
    """
    Tests the generate_uuid endpoint to ensure it generates a valid UUID and stores the secret.
    """
    payload = generate_uuid_payload()
    response = make_api_call(client, "/generateuuid", method="POST", **payload)
    assert_valid_create_response(response)

def test_create_secret_with_empty_secret():
    """
    Tests the generate_uuid endpoint to ensure it returns a 400 status code when 
    an empty secret is provided.
    """
    payload = generate_uuid_payload(secret_text="")
    response = make_api_call(client, "/generateuuid", method="POST", **payload)
    assert response.status_code == 400
    assert response.json() == {"message": "Secret cannot be empty"}
