from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    String, DateTime, Integer, select, ForeignKey, update, delete, orm
)
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import (
    Mapped, mapped_column, relationship
)
from typing import List
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app

from datetime import datetime
import os
import uuid

from .schemes import WordTranslationSchema, WordSchema, LanguageSchema, ListOfTrainingResultSchema

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    username: Mapped[str] = mapped_column(String(128), index=True, unique=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    dictionaries: Mapped[List['Dictionary']] = relationship(back_populates='user')

    def __repr__(self):
        return f'User(username={self.username})'

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def get_by_identity(username: str):
        query = select(User).where(User.username == username)
        user = db.session.execute(query).one_or_none()
        if user:
            return user[0]

    @staticmethod
    def register(username: str, password: str):
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user


class Language(db.Model):
    __tablename__ = 'languages'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, unique=True)
    code: Mapped[str] = mapped_column(String(5), unique=True)

    dictionaries_where_lang_learned: Mapped['Dictionary'] = relationship(foreign_keys='Dictionary.learned_language_id',
        back_populates='learned_language')
    dictionaries_where_lang_target: Mapped['Dictionary'] = relationship(foreign_keys='Dictionary.target_language_id',
        back_populates='target_language')

    def to_schema(self) -> LanguageSchema:
        return LanguageSchema(
            id=self.id,
            name=self.name,
            code=self.code,
        )

    @staticmethod
    def get_all() -> List:
        """
        returns all languages
        """
        query = select(Language)
        return db.session.execute(query).scalars().all()


class Dictionary(db.Model):
    __tablename__ = 'dictionaries'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(User.id))
    learned_language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Language.id))
    target_language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Language.id))

    __table_args__ = (UniqueConstraint('user_id', 'learned_language_id', 'target_language_id', name='_user_languages_uc'),)

    user: Mapped[User] = relationship(foreign_keys='Dictionary.user_id', back_populates='dictionaries')
    words: Mapped[List['Word']] = relationship('Word', back_populates='dictionary', cascade='all,delete')

    learned_language: Mapped[Language] = relationship(foreign_keys='Dictionary.learned_language_id',
        back_populates='dictionaries_where_lang_learned')
    target_language: Mapped[Language] = relationship(foreign_keys='Dictionary.target_language_id', 
        back_populates='dictionaries_where_lang_target')

    @classmethod
    def get_for_user(cls, user: User) -> List:
        """
        returns a List of dictionaries for the given user
        """
        query = select(Dictionary).where(Dictionary.user == user)
        return db.session.execute(query).scalars().all()


class Word(db.Model):
    __tablename__ = 'words'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    word: Mapped[str] = mapped_column(String(128), index=True, unique=True)
    progress: Mapped[int] = mapped_column(Integer(), default=0, server_default='0')

    dictionary_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Dictionary.id))
    dictionary: Mapped[Dictionary] = relationship('Dictionary', back_populates='words')

    translations: Mapped[List['WordTranslation']] = relationship(back_populates='word', cascade='all,delete')

    @orm.validates('progress')
    def validate_progress(self, key, value):
        if not 0 <= value <= 100:
            raise ValueError(f'Invalid progress: {value}')
        return value

    @staticmethod
    def get_for_dictionary(dictionary: Dictionary) -> List:
        """
        returns a List of words for given dictionary
        """
        query = select(Word).where(Word.dictionary == dictionary)
        return db.session.execute(query).scalars().all()

    def to_schema(self) -> WordSchema:
        return WordSchema(
            id=self.id,
            word=self.word,
            translations=[translation.to_schema() for translation in self.translations],
            dictionary_id=self.dictionary_id,
            progress=self.progress
        )

    @staticmethod
    def get_by_id(id):
        query = select(Word).where(Word.id == id)
        res = db.session.execute(query).one_or_none()
        if res:
            return res[0]

    def create(word_data: WordSchema):
        try:
            word = Word(id=word_data.id, word=word_data.word, dictionary_id=word_data.dictionary_id)
            db.session.add(word)

            for translation_obj in word_data.translations:
                translation = WordTranslation(id=translation_obj.id, translation=translation_obj.translation, word_id=word.id)
                db.session.add(translation)

            db.session.commit()

        except Exception as ex:
            db.session.rollback()
            raise ex

    def update(word_data: WordSchema):
        try:
            query_update_word = update(Word) \
                .where(Word.id == word_data.id) \
                .values(word = word_data.word, progress = word_data.progress)
            db.session.execute(query_update_word)

            query_delete_translations = delete(WordTranslation) \
                .where(WordTranslation.word_id == word_data.id)
            db.session.execute(query_delete_translations)

            for translation_obj in word_data.translations:
                translation = WordTranslation(id=translation_obj.id, translation=translation_obj.translation, word_id=word_data.id)
                db.session.add(translation)

            db.session.commit()

        except Exception as ex:
            db.session.rollback()
            raise ex

    @staticmethod
    def apply_training_results(data: ListOfTrainingResultSchema):
        try: 
            for result in data.training_results:
                word = Word.get_by_id(result.word_id)
                word.progress = min(result.points + word.progress, 100)
                db.session.add(word)
            db.session.commit()
        except Exception as ex:
            db.session.rollback()
            print(ex)
            raise ex


class WordTranslation(db.Model):
    __tablename__ = 'word_translation'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    translation: Mapped[str] = mapped_column(String(128))
    word_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Word.id))

    word: Mapped[Word] = relationship(back_populates='translations')

    @classmethod 
    def get_words_and_translations_for_dictionary(cls, dictionary: Dictionary) -> List[tuple]:
        """
        returns a List of tuples: [(word, translation),]
        """
        query = select(Word.word, WordTranslation.translation) \
            .join(cls) \
            .where(Word.dictionary == dictionary)
        return db.session.execute(query).all()

    def to_schema(self) -> WordTranslationSchema:
        return WordTranslationSchema(
            id=self.id,
            translation=self.translation
        )
