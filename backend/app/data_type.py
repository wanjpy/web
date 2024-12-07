from typing import Any, Optional
from pydantic import BaseModel
from locales import _


class LoginData(BaseModel):
    username: str
    password: str


class ApiResponse(BaseModel):
    code: int  # 0 正确，1错误
    message: str
    data: Optional[Any] = None

    def __init__(self, code: str, message: str, data: Any = None, **kwargs):
        super().__init__(code=code, message=_(message), data=data, **kwargs)


class PaginationData(BaseModel):
    page: int = 0
    page_size: int = 0
    total: int = 0
    data: list = 0


class CreateUser(BaseModel):
    username: str
    password: str
    email: str
    phone: str


class UpdateUser(BaseModel):
    username: str
    email: str
    phone: str
    id: int
    status: int
    role: int
