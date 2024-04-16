from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    String, DateTime, select
)
from sqlalchemy.sql import func
from sqlalchemy.orm import (
    Mapped, mapped_column
)

from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app

from datetime import datetime
import os

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(128), index=True, unique=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f'User(email={self.email})'

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    @classmethod
    def get_by_identity(cls, email: str):
        query = select(cls).where(cls.email == email)
        user = db.session.execute(query).one_or_none()
        if user:
            return user[0]
