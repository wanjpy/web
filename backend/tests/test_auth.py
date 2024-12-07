from blacksheep import Content, Response
import orjson
import pytest
from blacksheep.testing import TestClient

from app.config import AUTH_SECRET_KEY
from app.auth import Role
from web.xy.backend.app.data_type import ApiResponse
from utils.common import secret_serializer


@pytest.mark.asyncio
async def test_auth_registry(test_client: TestClient) -> None:
    data = {"username": "test", "password": "test", "email": "", "phone": ""}
    response: Response = await test_client.post("/api/login", content=Content(b'application/json', orjson.dumps(data)))
    assert response.status == 200
    data = await response.json()


@pytest.mark.asyncio
async def test_auth_login(test_client: TestClient) -> None:
    data = {'username': "test", 'password': "test"}
    response: Response = await test_client.post("/api/login", content=Content(b'application/json', orjson.dumps(data)))
    assert response.status == 200
    assert response is not None
    print(response)
    data = await response.json()

    assert data is not None
    assert "code" in data
    actual_res = ApiResponse(**data)
    if actual_res.code == 0:
        assert response.headers.get(b"Authorization") is not None
        assert "token" in response.cookies
    else:
        assert actual_res.message == 'user does not exist'


@pytest.mark.asyncio
async def test_special_auth_nologin(test_client: TestClient):
    response: Response = await test_client.get("/api/auth/special")
    assert response.status == 401


@pytest.mark.asyncio
async def test_special_auth_login(test_client: TestClient):
    cookies = [(b'token', secret_serializer.dumps(
        {'username': "hx",  'role': Role.special.value}))]
    response: Response = await test_client.get("/api/auth/special", cookies=cookies)
    assert response.status == 200


@pytest.mark.asyncio
async def test_user_auth_nologin(test_client: TestClient):
    response: Response = await test_client.get("/api/auth/user")
    assert response.status == 401


@pytest.mark.asyncio
async def test_user_auth_login(test_client: TestClient):
    cookies = [(b'token', secret_serializer.dumps(
        {'namename': 'test', 'role': Role.user.value}))]
    response: Response = await test_client.get("/api/auth/user", cookies=cookies)
    assert response.status == 200
