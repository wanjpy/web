
from locales import accept_language


async def middleware_storage_lang(request, handler):
    lang = request.headers.get_first(b'Accept-Language') or b"en-US"
    lang = lang.decode("utf8").split(",")[0]
    accept_language.set(lang)
    response = await handler(request)
    return response
