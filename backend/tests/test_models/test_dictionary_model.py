from datetime import datetime, timezone, timedelta
import unittest
from app import create_app, db
from app.database import User, Word, Language, WordTranslation, Dictionary
from app.config import Config
from .. import BaseTestCase


class TestDictionaryModel(BaseTestCase):
    """
    Tests for Dictionary model
    """

    def setUp(self):
        self.user = User(username="Alex")
        self.user.set_password("password")
        db.session.add(self.user)

        self.english_lang = Language(name="English", code="en")
        self.spanish_lang = Language(name="Spanish", code="es")
        db.session.add_all((self.english_lang, self.spanish_lang))
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_get_dictionaries_for_user(self):
        dictionary1 = Dictionary(
            user_id=self.user.id,
            learned_language=self.english_lang,
            target_language=self.spanish_lang,
        )
        db.session.add(dictionary1)

        dictionaries_set_1 = Dictionary.get_for_user(self.user)

        dictionary2 = Dictionary(
            user_id=self.user.id,
            learned_language=self.spanish_lang,
            target_language=self.english_lang,
        )
        db.session.add(dictionary2)

        dictionaries_set_2 = Dictionary.get_for_user(self.user)

        self.assertEqual(dictionaries_set_1, [dictionary1])
        self.assertEqual(set(dictionaries_set_2), set((dictionary1, dictionary2)))


if __name__ == "__main__":
    unittest.main()
