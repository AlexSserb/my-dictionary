from pydantic import model_validator
from typing_extensions import Self
from uuid import UUID

from .common_schema import CommonSchema


class LoginSchema(CommonSchema):
    username: str
    password: str


class RegisterSchema(CommonSchema):
    username: str
    password: str


class ChangePasswordSchema(CommonSchema):
    new_password: str
    old_password: str


class TokenPairSchema(CommonSchema):
    access_token: str
    refresh_token: str
