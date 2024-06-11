from app import settings
from datetime import timedelta
import os


class Config(object):
    DEBUG = True
    DEVELOPMENT = True
    SECRET_KEY = settings.SECRET_KEY

    SQLALCHEMY_DATABASE_URI = (
        f'postgresql://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}' + \
        f'@{settings.DATABASE_ADDRESS}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}'
    )

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    