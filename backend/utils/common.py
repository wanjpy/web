from imghdr import tests as pic_format_function_list
from contextlib import asynccontextmanager
from functools import wraps
import hashlib
import logging
import time
from blacksheep.server.dataprotection import get_serializer
from essentials.exceptions import UnauthorizedException
import httpx
import jwt


def patch_json():
    import json
    import ujson
    json.dumps = ujson.dumps
    json.loads = ujson.loads


def get_logger():
    return logging.getLogger("uvicorn")


def decrypt(token: str, secret_key, algorithms: list = ['HS256']):
    try:
        ret = jwt.decode(token, secret_key, algorithms=algorithms)
        return ret
    except jwt.exceptions.ExpiredSignatureError as err:
        return str(err)


def encrypt(payload: dict, secret_key, algorithms: list = 'HS256'):
    token = jwt.encode(payload, key=secret_key, algorithm=algorithms)
    return token


def password_encrypt(plaintext):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(plaintext.encode('utf-8'))
    return sha256_hash.hexdigest()[20:]


secret_serializer = get_serializer("test", purpose="pages")


def cache(expire: int = 3600):
    _d = {}

    def wrapper(func):
        @wraps(func)
        async def wrapped(*args, **kwargs):
            if _d.get("expire", 0) < time.time():
                _d['result'] = await func(*args, **kwargs)
                _d['expire'] = time.time() + expire
            return _d['result']

        return wrapped
    return wrapper


def serializer_decrypt(s: str):
    try:
        return secret_serializer.loads(s)
    except:
        raise UnauthorizedException()


_client = None


@asynccontextmanager
async def AsyncClient():
    global _client
    if not _client:
        _client = httpx.AsyncClient()
    yield _client


def get_pic_format(pic_bytes: bytes):
    for func in pic_format_function_list:
        fmt = func(pic_bytes, '')
        if fmt:
            return fmt


if __name__ == "__main__":
    ...
