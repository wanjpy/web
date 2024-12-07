
import gettext

import contextvars

accept_language = contextvars.ContextVar('Accept-Language')

locale_dir: str = "locales"


def get_translation_():
    translations = dict()

    def _wrap(lang: str):
        if not translations.get(lang):
            translations[lang] = gettext.translation(
                'message', localedir=locale_dir, languages=[lang], fallback=True)
        return translations.get(lang)
    return _wrap


get_translation = get_translation_()


def _(message):
    translation = get_translation(accept_language.get('en'))
    return translation.gettext(message)
