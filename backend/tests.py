from datetime import datetime, timezone, timedelta
import unittest
from app import create_app, db
from app.models import User, Word, Language, WordTranslation, Dictionary
from app.config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'


class WordsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        self.user = User(email='ex@example.com')
        self.user.set_password('password')
        db.session.add(self.user)

        self.english_lang = Language(name='English')
        self.spanish_lang = Language(name='Spanish')
        db.session.add_all([self.english_lang, self.spanish_lang])
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_get_dictionaries_for_user(self):
        dictionary1 = Dictionary(user_id=self.user.id, learned_language=self.english_lang, target_language=self.spanish_lang)
        db.session.add(dictionary1)

        dictionaries_set_1 = Dictionary.get_for_user(self.user)

        dictionary2 = Dictionary(user_id=self.user.id, learned_language=self.spanish_lang, target_language=self.english_lang)
        db.session.add(dictionary2)

        dictionaries_set_2 = Dictionary.get_for_user(self.user)

        self.assertEqual(dictionaries_set_1, [dictionary1])
        self.assertEqual(set(dictionaries_set_2), set((dictionary1, dictionary2)))

    def create_two_dictionaries(self) -> tuple[Dictionary]:
        dictionary1 = Dictionary(user_id=self.user.id, learned_language=self.english_lang, target_language=self.spanish_lang)
        dictionary2 = Dictionary(user_id=self.user.id, learned_language=self.spanish_lang, target_language=self.english_lang)
        db.session.add_all((dictionary1, dictionary2))
        db.session.commit()

        return dictionary1, dictionary2

    def test_get_words_for_dictionary(self):
        dictionary1, dictionary2 = self.create_two_dictionaries()

        word1 = Word(word='word1', dictionary_id=dictionary1.id)
        db.session.add(word1)

        self.assertEqual(Word.get_for_dictionary(dictionary1), [word1,])

        word2 = Word(word='word2', dictionary_id=dictionary1.id)
        db.session.add(word2)

        self.assertEqual(set(Word.get_for_dictionary(dictionary1)), set((word1, word2)))
        self.assertEqual(Word.get_for_dictionary(dictionary2), [])

    def test_get_words_and_translations_for_dictionary(self):
        dictionary1, dictionary2 = self.create_two_dictionaries()

        word1 = Word(word='word1', dictionary_id=dictionary1.id)
        word2 = Word(word='word2', dictionary_id=dictionary1.id)
        db.session.add_all((word1, word2))

        word_translation1 = WordTranslation(word=word1, translation='translation1')
        word_translation2 = WordTranslation(word=word2, translation='translation2')
        db.session.add_all((word_translation1, word_translation2))
        db.session.commit()

        words_and_translations1 = WordTranslation.get_words_and_translations_for_dictionary(dictionary1)
        words_and_translations2 = WordTranslation.get_words_and_translations_for_dictionary(dictionary2)

        self.assertEqual(set(words_and_translations1), set((
            ('word1', 'translation1'), 
            ('word2', 'translation2')
        )))
        self.assertEqual(words_and_translations2, [])


if __name__ == '__main__':
    unittest.main(verbosity=1)
