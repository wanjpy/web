from blacksheep import FromHeader, FromJSON, FromQuery, delete, get, post, bad_request, status_code, file, auth, Request
from guardpost import Identity
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.data_type import ApiResponse, CreateUser, PaginationData, UpdateUser
from utils.common import password_encrypt

from data.dbmodel import User
from app.auth import Role


@auth(Role.user)
@get("/api/case/results")
async def results(session: AsyncSession, page: FromQuery[int] = FromQuery(1), page_size: FromQuery[int] = FromQuery(20)):
    data = PaginationData()
    data.page = page.value
    data.page_size = page_size.value
    data.total = 2
    # data: CreateUser = data.value
    # data.password = password_encrypt(data.password)
    # async with session:
    #     result = await session.execute(select(User).filter_by(username=data.username))
    #     if result.scalar():
    #         return ApiResponse(1, 'username is already in use')
    #     session.add(User(**data.model_dump()))
    #     await session.commit()
    data.data = [{'casename': 'test', 'result': 'fail', 'handler': 'a', 'conclusion': 'conclusion'},
            {'casename': 'test2', 'result': 'fail', 'handler': 'b', 'conclusion': 'conclusion'}]
    return ApiResponse(0, 'success', data=data)
