from datetime import datetime, timezone, timedelta
import unittest
from uuid import uuid4
from sqlalchemy.orm import Session

from app import create_app, db
from app.database import User, Word, Language, WordTranslation, Dictionary
from app.schemes import SaveWordSchema
from app.config import Config
from .. import BaseTestCase


class TestWordModels(BaseTestCase):
    '''
    Tests for Word amd WordTranslation models
    '''
    
    def setUp(self):
        self.user = User(username='Alex')
        self.user.set_password('password')
        db.session.add(self.user)

        self.english_lang = Language(name='English', code='en')
        self.spanish_lang = Language(name='Spanish', code='es')
        db.session.add_all((self.english_lang, self.spanish_lang))
        db.session.commit()

        self.create_two_dictionaries()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def create_two_dictionaries(self):
        self.dict1 = Dictionary(user_id=self.user.id, learned_language=self.english_lang, target_language=self.spanish_lang)
        self.dict2 = Dictionary(user_id=self.user.id, learned_language=self.spanish_lang, target_language=self.english_lang)
        db.session.add_all((self.dict1, self.dict2))
        db.session.commit()

    def test_get_words_for_dictionary(self):
        word1 = Word(word='word1', dictionary_id=self.dict1.id)
        db.session.add(word1)

        self.assertEqual(Word.get_for_dictionary(self.dict1), [word1,])

        word2 = Word(word='word2', dictionary_id=self.dict1.id)
        db.session.add(word2)

        self.assertEqual(set(Word.get_for_dictionary(self.dict1)), set((word1, word2)))
        self.assertEqual(Word.get_for_dictionary(self.dict2), [])

    def test_get_words_and_translations_for_dictionary(self):
        word1 = Word(word='word1', dictionary_id=self.dict1.id)
        word2 = Word(word='word2', dictionary_id=self.dict1.id)
        db.session.add_all((word1, word2))

        word_translation1 = WordTranslation(word=word1, translation='translation1')
        word_translation2 = WordTranslation(word=word2, translation='translation2')
        db.session.add_all((word_translation1, word_translation2))
        db.session.commit()

        words_and_translations1 = WordTranslation.get_words_and_translations_for_dictionary(self.dict1)
        words_and_translations2 = WordTranslation.get_words_and_translations_for_dictionary(self.dict2)

        self.assertEqual(set(words_and_translations1), set((
            ('word1', 'translation1'), 
            ('word2', 'translation2')
        )))
        self.assertEqual(words_and_translations2, [])
    
    def test_save_words_and_translations(self):
        data_to_save = SaveWordSchema(**{
            'id': uuid4(),
            'word': 'example',
            'translations': [
                { 'id': uuid4(), 'translation': 'example_translation1' },
                { 'id': uuid4(), 'translation': 'example_translation2' }
            ],
            'dictionary_id': self.dict1.id
        })

        Word.save(data_to_save)

        with Session(db.engine) as session:
            saved_word = session.get(Word, data_to_save.id)

            self.assertEqual(saved_word.word, data_to_save.word)
            self.assertEqual(saved_word.dictionary, session.get(Dictionary, data_to_save.dictionary_id))
            self.assertEqual(set(saved_word.translations), set((
                session.get(WordTranslation, data_to_save.translations[0].id),
                session.get(WordTranslation, data_to_save.translations[1].id)
            )))


if __name__ == '__main__':
    unittest.main()
    