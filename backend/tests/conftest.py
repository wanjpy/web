# ./tests/conftest.py
import pytest_asyncio
from blacksheep.testing import TestClient
from app.main import app as app_server


@pytest_asyncio.fixture(scope="session")
async def api():
    await app_server.start()
    yield app_server
    await app_server.stop()


@pytest_asyncio.fixture(scope="session")
async def test_client(api):
    return TestClient(api)
