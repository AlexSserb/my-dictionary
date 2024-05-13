from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from datetime import datetime

from .database import db, User


def create_app(config_name='app.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_name)
    cors = CORS(app)
    jwt = JWTManager(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    from app.blueprints import accounts, dictionaries, languages
    app.register_blueprint(accounts)
    app.register_blueprint(dictionaries)
    app.register_blueprint(languages)

    return app