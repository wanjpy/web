from pathlib import Path
from blacksheep.server.env import is_production
from uvicorn.logging import DefaultFormatter
class CustomFormatter(DefaultFormatter):
    def format(self, record):
        current_file = Path(record.pathname)
        project_dir = Path().cwd()
        relative_path = ""
        if current_file.is_relative_to(project_dir):
            relative_path = current_file.relative_to(project_dir)
        record.relative_path = relative_path
        return super().format(record)

def get_log_config():
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "()": CustomFormatter,
                # "()": "uvicorn.logging.DefaultFormatter",
                "fmt": "%(asctime)s %(levelprefix)s %(relative_path)s %(message)s",
                # "use_colors": None
            },
            "access": {
                "()": "uvicorn.logging.AccessFormatter",
                "fmt": "%(asctime)s - %(levelprefix)s %(client_addr)s - \"%(request_line)s\" %(status_code)s"
            }
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stderr"
            },
            "default_file": {
                "formatter": "default",
                "class": "logging.handlers.RotatingFileHandler",
                "filename": "logs/uvicorn_default.log",
                "maxBytes": 10485760,
                "backupCount": 5
            },
            "access": {
                "formatter": "access",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout"
            },
            "access_file": {
                "formatter": "access",
                "class": "logging.handlers.RotatingFileHandler",
                "filename": "logs/uvicorn_access.log",
                "maxBytes": 10485760,
                "backupCount": 5
            }
        },
    }
    if is_production():
        log_config['loggers'] = {
            "uvicorn": {
                "handlers": [
                    "default_file"
                ],
                "level": "INFO"
            },
            "blacksheep.server": {
                "handlers": [
                    "default_file"
                ],
                "level": "INFO"
            },
            "uvicorn.error": {

                "level": "INFO"
            },
            "uvicorn.access": {
                "handlers": [
                    "access_file"
                ],
                "level": "INFO",
                "propagate": False
            }
        }
    else:
        log_config['loggers'] = {
            "uvicorn": {
                "handlers": [
                    "default"
                ],
                "level": "INFO"
            },
            "uvicorn.error": {
                "level": "INFO"
            },
            "uvicorn.access": {
                "handlers": [
                    "access"
                ],
                "level": "INFO",
                "propagate": False
            }
        }
    return log_config
