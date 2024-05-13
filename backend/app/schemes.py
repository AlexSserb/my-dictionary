from pydantic import BaseModel, ConfigDict, model_validator
from pydantic.alias_generators import to_camel
from typing_extensions import Self
from uuid import UUID


class CommonModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class LoginSchema(CommonModel):
    username: str
    password: str


class RegisterSchema(CommonModel):
    username: str
    password: str


class ChangePasswordSchema(CommonModel):
    new_password: str
    old_password: str


class TokenPairSchema(CommonModel):
    access_token: str
    refresh_token: str


class LanguageSchema(CommonModel):
    id: UUID
    name: str

class DictionarySchema(CommonModel):
    id: UUID
    learned_language: LanguageSchema
    target_language: LanguageSchema


class ListOfDictionariesSchema(CommonModel):
    dictionaries: list[DictionarySchema]


class CreateDictionarySchema(CommonModel):
    learned_language_id: UUID
    target_language_id: UUID

    @model_validator(mode='after')
    def validate_fields(self) -> Self:
        if self.learned_language_id == self.target_language_id:
            raise ValueError('Languages must be different')
        return self
