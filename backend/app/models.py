from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    String, DateTime, select, ForeignKey
)
from sqlalchemy.sql import func
from sqlalchemy.orm import (
    Mapped, mapped_column, relationship
)

from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app

from datetime import datetime
import os
import uuid

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    email: Mapped[str] = mapped_column(String(128), index=True, unique=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    created_on: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    dictionaries: Mapped['Dictionary'] = relationship(back_populates='user')

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


class Language(db.Model):
    __tablename__ = 'languages'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, unique=True)

    dictionaries_where_lang_learned: Mapped['Dictionary'] = relationship(foreign_keys='Dictionary.learned_language_id',
        back_populates='learned_language')
    dictionaries_where_lang_target: Mapped['Dictionary'] = relationship(foreign_keys='Dictionary.target_language_id',
        back_populates='target_language')


class Dictionary(db.Model):
    __tablename__ = 'dictionaries'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(User.id))
    learned_language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Language.id))
    target_language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Language.id))

    user: Mapped[User] = relationship(foreign_keys='Dictionary.user_id', back_populates='dictionaries')
    words: Mapped['Word'] = relationship(back_populates='dictionary')

    learned_language: Mapped[Language] = relationship(foreign_keys='Dictionary.learned_language_id',
        back_populates='dictionaries_where_lang_learned')
    target_language: Mapped[Language] = relationship(foreign_keys='Dictionary.target_language_id', 
        back_populates='dictionaries_where_lang_target')

    @classmethod
    def get_for_user(cls, user: User) -> list:
        """
        returns a list of dictionaries for the given user
        """
        query = select(Dictionary).where(Dictionary.user == user)
        return db.session.execute(query).scalars().all()


class Word(db.Model):
    __tablename__ = 'words'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    word: Mapped[str] = mapped_column(String(128), index=True, unique=True)
    dictionary_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Dictionary.id))

    dictionary: Mapped[Dictionary] = relationship(back_populates='words')
    translations: Mapped['WordTranslation'] = relationship(back_populates='word')

    @classmethod
    def get_for_dictionary(cls, dictionary: Dictionary) -> list:
        """
        returns a list of words for given dictionary
        """
        query = select(Word).where(Word.dictionary == dictionary)
        return db.session.execute(query).scalars().all()


class WordTranslation(db.Model):
    __tablename__ = 'word_translation'

    id: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, primary_key=True)
    translation: Mapped[str] = mapped_column(String(128))
    word_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(Word.id))

    word: Mapped[Word] = relationship(back_populates='translations')

    @classmethod 
    def get_words_and_translations_for_dictionary(cls, dictionary: Dictionary) -> list[tuple]:
        """
        returns a list of tuples: [(word, translation),]
        """
        query = select(Word.word, WordTranslation.translation) \
            .join(cls) \
            .where(Word.dictionary == dictionary)
        return db.session.execute(query).all()
