from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from datetime import datetime

from .database import db, User


def create_app(config_name="app.config.Config"):
    app = Flask(__name__)
    app.config.from_object(config_name)
    cors = CORS(app)
    jwt = JWTManager(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    from app.blueprints import (
        accounts_bp,
        dictionaries_bp,
        languages_bp,
        words_bp,
        translations_bp,
    )

    app.register_blueprint(accounts_bp)
    app.register_blueprint(dictionaries_bp)
    app.register_blueprint(languages_bp)
    app.register_blueprint(words_bp)
    app.register_blueprint(translations_bp)

    return app
