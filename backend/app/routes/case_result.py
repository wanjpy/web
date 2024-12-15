from blacksheep import FromHeader, FromJSON, FromQuery, delete, get, post, bad_request, status_code, file, auth, Request
from guardpost import Identity
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.data_type import ApiResponse, CreateUser, PaginationData, UpdateUser
from utils.common import password_encrypt

from data.dbmodel import User
from app.auth import Role


@auth(Role.user)
@get("/api/test/users")
async def get_users(session: AsyncSession):
    async with session:
        result = await session.execute(select(User).add_columns(User.id, User.username, User.nickname).filter())
        users = list()
        for user in result.scalars().all():
            users.append(
                {"id": user.id, "username": user.username, "nickname": user.email})

    return ApiResponse(code=0, message="success", data=users)


@auth(Role.user)
@get("/api/test/results")
async def results(session: AsyncSession, page: FromQuery[int] = FromQuery(1), page_size: FromQuery[int] = FromQuery(20)):
    data = PaginationData()
    data.page = page.value
    data.page_size = page_size.value

    # data: CreateUser = data.value
    # data.password = password_encrypt(data.password)
    # async with session:
    #     result = await session.execute(select(User).filter_by(username=data.username))
    #     if result.scalar():
    #         return ApiResponse(1, 'username is already in use')
    #     session.add(User(**data.model_dump()))
    #     await session.commit()
    user = list()
    user.append({'id':1, 'case_id': f'test00000001', 'case_name': f'测试test00000001test00000001test00000001', 'start_time': '2024-12-12 12:12',
                 'guardian': 2,  'detail': 'have a wrong', 'handler': None, 'conclusion': 2})
    for i in range(2, 14):
        user.append({'id': i, 'case_id': f'test00{i}', 'case_name': f'测试{i}', 'start_time': '2024-12-12 12:12', 'dts': '',
                     'guardian': i % 4+1,  'detail': '', 'handler': None, 'conclusion': i%6+1, 'report_url': 'https://ant.design/components/overview-cn/'})

    data.total = len(user)
    data.data = user[(page.value-1) *
                     page_size.value:page.value * page_size.value]
    return ApiResponse(0, 'success', data=data)
