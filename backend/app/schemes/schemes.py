from pydantic import model_validator
from typing_extensions import Self
from uuid import UUID

from .common_schema import CommonSchema


class LanguageSchema(CommonSchema):
    id: UUID
    name: str
    code: str


class ListOfLanguagesSchema(CommonSchema):
    languages: list[LanguageSchema]


class DictionarySchema(CommonSchema):
    id: UUID
    learned_language: LanguageSchema
    target_language: LanguageSchema


class ListOfDictionariesSchema(CommonSchema):
    dictionaries: list[DictionarySchema]


class CreateDictionarySchema(CommonSchema):
    learned_language_id: UUID
    target_language_id: UUID

    @model_validator(mode="after")
    def validate_fields(self) -> Self:
        if self.learned_language_id == self.target_language_id:
            raise ValueError("Languages must be different")
        return self


class WordTranslationSchema(CommonSchema):
    id: UUID
    translation: str


class WordSchema(CommonSchema):
    id: UUID
    word: str
    translations: list[WordTranslationSchema]
    dictionary_id: UUID
    progress: int = 0


class ListOfWordsSchema(CommonSchema):
    words: list[WordSchema]


class TranslateSchema(CommonSchema):
    """
    Schema for body validation for translation requests
    """

    language_from: LanguageSchema
    language_to: LanguageSchema
    text: str


class TranslationGoogleResult(CommonSchema):
    """
    Schema for google translation response
    """

    translations: list[WordTranslationSchema] | None


class TrainingResultSchema(CommonSchema):
    word_id: UUID
    points: int


class ListOfTrainingResultSchema(CommonSchema):
    training_results: list[TrainingResultSchema]
