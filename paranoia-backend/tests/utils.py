from typing import List, Optional
from app.models import Secret
from fastapi.testclient import TestClient
from uuid import UUID

def clean_test_db(db) -> None:
    """
    Remove all secrets from the test database.
    """
    db.query(Secret).delete()
    db.commit()

def make_api_call(client: TestClient, endpoint: str, method: str = "GET", **kwargs):
    """
    Make an API call with the given method and parameters.
    """
    method = method.upper()
    if method == "GET":
        return client.get(endpoint, **kwargs)
    elif method == "POST":
        return client.post(endpoint, json=kwargs)
    elif method == "DELETE":
        return client.delete(endpoint, json=kwargs)
    elif method == "PUT":
        return client.put(endpoint, **kwargs)
    raise ValueError(f"Unsupported HTTP method: {method}")

def create_test_secret(db, secret_text: str ="password", uuid: str ="test-uuid") -> Secret:
    """
    Create and return a test secret in the database.
    """
    secret = Secret(secret=secret_text, uuid=uuid)
    db.add(secret)
    db.commit()
    return secret

def create_test_secret_with_multiple_accesses(db, secret_text: str="password", uuid: str="test-uuid", remaining_accesses: int=5) -> Secret:
    """
    Create and return a test secret with multiple accesses in the database.
    """
    secret = Secret(secret=secret_text, uuid=uuid, remaining_accesses=remaining_accesses)
    db.add(secret)
    db.commit()
    return secret

def create_multiple_test_secrets(db, count: int, base_uuid: str="test-uuid", base_secret: str="test-secret") -> List[Secret]:
    """
    Create multiple test secrets with incrementing identifiers.
    """
    secrets = []
    for i in range(count):
        secret = create_test_secret(db, secret_text=f"{base_secret}-{i}", uuid=f"{base_uuid}-{i}")
        secrets.append(secret)
    return secrets

def get_secret_from_db(db, uuid: str) -> Optional[Secret]:
    """
    Return a secret from the database.
    """
    return db.query(Secret).filter(Secret.uuid == uuid).first()

def assert_secret_not_found(response) -> None:
    """
    Assert that the response indicates a secret was not found.
    """
    assert response.status_code == 404
    assert response.json() == {"message": "Secret not found!"}

def assert_secret_matches(actual: Secret, expected: Secret) -> None:
    """
    Assert that two secrets match on their key attributes.
    """
    assert actual.uuid == expected.uuid
    assert actual.secret == expected.secret
    assert actual.remaining_accesses == expected.remaining_accesses

def assert_valid_secret_response(response, expected_secret: str) -> None:
    """
    Assert that the response contains a valid secret.
    """
    assert response.status_code == 200
    assert response.json() == {"secret": expected_secret}

def is_valid_uuid(uuid_string: str) -> bool:
    """Check if a string is a valid UUID."""
    try:
        UUID(uuid_string)
        return True
    except ValueError:
        return False

def assert_valid_create_response(response) -> None:
    """Assert that the create secret response has the expected structure."""
    assert response.status_code == 201
    data = response.json()
    assert "uuid" in data
    assert is_valid_uuid(data["uuid"])

def generate_uuid_payload(secret_text: str = "test-secret") -> dict:
    """Helper to create payload with specific parameters."""
    payload = {
        "secret": secret_text,
    }
    return payload