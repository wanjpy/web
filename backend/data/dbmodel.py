import enum
from sqlalchemy import Boolean, Column, DateTime, Integer, SmallInteger, String
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import registry, relationship  # type: ignore
from sqlalchemy.sql import expression, func

mapper_registry = registry()
metadata = mapper_registry.metadata

Base = mapper_registry.generate_base()


class UTCNow(expression.FunctionElement):
    type = DateTime()  # type: ignore


@compiles(UTCNow, "postgresql")
def pg_utcnow(element, compiler, **kw):
    return "TIMEZONE('utc', CURRENT_TIMESTAMP)"


@compiles(UTCNow, "sqlite")
def sqlite_utcnow(element, compiler, **kw):
    return "CURRENT_TIMESTAMP"


class ETagMixin:
    ACTIVE = 1
    DISABLE = 0
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, server_default=UTCNow(), nullable=False)
    updated_at = Column(DateTime, server_default=UTCNow(), nullable=False, onupdate=func.now())
    etag = Column(String(50), server_default=UTCNow(), nullable=False)


class User(ETagMixin, Base):
    __tablename__ = "user"
    
    username = Column(String(50), nullable=False)
    password = Column(String(20), nullable=False)
    email = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    status = Column(Boolean, default=ETagMixin.DISABLE)
    # 二进制 1111  admin,specil,user, guest
    role = Column(SmallInteger, default=1)

    def info(self):
        return {'id': self.id, 'username': self.username, 'email': self.email, 'phone': self.phone, 'role': self.role}

    def detail(self):
        data = self.info()
        data['status'] = self.status
        data['id'] = self.id
        return data