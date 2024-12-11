from blacksheep import FromHeader, FromJSON, FromQuery, delete, get, post, bad_request, status_code, file, auth, Request
from guardpost import Identity
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.data_type import ApiResponse, CreateUser, PaginationData, UpdateUser
from utils.common import password_encrypt

from data.dbmodel import User
from app.auth import Role


class AcceptLanguage(FromHeader[str]):
    name = "accept-language"


@post("/api/user")
async def create_user(data: FromJSON[CreateUser], session: AsyncSession):
    data: CreateUser = data.value
    data.password = password_encrypt(data.password)
    async with session:
        result = await session.execute(select(User).filter_by(username=data.username))
        if result.scalar():
            return ApiResponse(1, 'username is already in use')
        session.add(User(**data.model_dump()))
        await session.commit()
    return ApiResponse(0, 'success')


@auth(Role.user)
@post("/api/user/{userid}")
async def update_user(userid: int, data: FromJSON[UpdateUser], session: AsyncSession, user: Identity):
    login_user = user.claims
    if Role.admin.value & login_user.get('role', 0) == 0 and userid != login_user.get('id', 0):
        return ApiResponse(1, 'permission denied')
    data: UpdateUser = data.value
    async with session:
        result = await session.execute(select(User).filter_by(id=userid))
        user = result.scalar()
        if not user:
            return ApiResponse(1, 'user not exist')
        for attr in ['username', 'phone', 'email', 'status', 'role']:
            setattr(user, attr, getattr(data, attr))
        session.add(user)
        await session.commit()
    return ApiResponse(0, 'success')


@auth(Role.admin)
@delete("/api/user/{userid}")
async def delete_user(userid: int, session: AsyncSession):
    async with session:
        result = await session.execute(select(User).filter_by(id=userid))
        user = result.scalar()
        if user:
            await session.delete(user)
            await session.commit()
        else:
            return ApiResponse(1, 'user not exist')
    return ApiResponse(0, 'success')


@auth(Role.admin)
@get("/api/users")
async def get_users(session: AsyncSession, page: FromQuery[int] = FromQuery(1), page_size: FromQuery[int] = FromQuery(20)):
    data = PaginationData()
    data.page = page.value
    data.page_size = page_size.value
    async with session:
        result = await session.execute(select(func.count("*")).select_from(User))
        data.total = result.scalar()
        result = await session.execute(select(User).offset((page.value - 1) * page_size.value).limit(page_size.value))
        users = list()
        for user in result.scalars().all():
            users.append(user.detail())
        data.data = users

    return ApiResponse(code=0, message="success", data=data.model_dump())

@auth(Role.user)
@get("/api/test/users")
async def get_users(session: AsyncSession):
    async with session:
        result = await session.execute(select(User).add_columns(User.id, User.username, User.nickname).filter(User.role < Role.admin.value))
        users = list()
        for user in result.scalars().all():
            users.append({"id": user.id, "username": user.username, "nickname": user.email})   

    return ApiResponse(code=0, message="success", data=users)
