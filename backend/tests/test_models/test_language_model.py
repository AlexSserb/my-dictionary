from datetime import datetime, timezone, timedelta
import unittest
from app import create_app, db
from app.database import User, Word, Language
from app.config import Config
from .. import BaseTestCase


class TestLanguageModel(BaseTestCase):
    """
    Tests for Language model
    """

    def setUp(self):
        self.user = User(username="Alex")
        self.user.set_password("password")
        db.session.add(self.user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_get_all_languages(self):
        self.english_lang = Language(name="English", code="en")
        self.spanish_lang = Language(name="Spanish", code="es")
        db.session.add_all((self.english_lang, self.spanish_lang))
        db.session.commit()

        languages = Language.get_all()

        self.assertEqual(
            set(languages),
            set(
                (
                    self.english_lang,
                    self.spanish_lang,
                )
            ),
        )


if __name__ == "__main__":
    unittest.main()
