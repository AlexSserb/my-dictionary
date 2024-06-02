import json
import unittest
from unittest.mock import patch
from flask_jwt_extended import create_access_token
from uuid import uuid4

from .. import BaseTestCaseWithoutDB
from app.database import *


class TestWordsAPI(BaseTestCaseWithoutDB):
    '''
    Tests for API from 'words' blueprint
    '''

    def setUp(self):
        self.user = User(username='Alex')
        self.user.set_password('password')

        self.english_lang = Language(id=uuid4(), name='English', code='en')
        self.spanish_lang = Language(id=uuid4(), name='Spanish', code='es')

        self.dict1 = Dictionary(id=uuid4(), user_id=self.user.id, learned_language=self.english_lang, target_language=self.spanish_lang)
        self.dict2 = Dictionary(id=uuid4(), user_id=self.user.id, learned_language=self.spanish_lang, target_language=self.english_lang)

        token = create_access_token(self.user.username, additional_claims={ 'username': self.user.username })
        self.headers = { 'headers' : { 'Authorization': f'Bearer {token}' }}

    def _set_test_data_get_words_for_dict(self):
        '''
        Test data for test function: test_get_words_for_dict
        '''
        self.word1 = Word(id=uuid4(), word='word1', dictionary_id=self.dict1.id)
        self.word2 = Word(id=uuid4(), word='word2', dictionary_id=self.dict2.id)

        self.word_translation1 = WordTranslation(id=uuid4(), translation='translation1', word_id=self.word1.id)
        self.word_translation2 = WordTranslation(id=uuid4(), translation='translation2', word_id=self.word1.id)
        self.word_translation3 = WordTranslation(id=uuid4(), translation='translation3', word_id=self.word2.id)

        self.word1.translations, self.word2.translations = [self.word_translation1, self.word_translation2], [self.word_translation3,]

    @patch('app.blueprints.words.db.get_or_404')
    @patch('app.database.Word.get_for_dictionary')
    def test_get_words_for_dict(self, mock_get_for_dictionary, mock_get_dict_or_404):
        self._set_test_data_get_words_for_dict()

        mock_get_for_dictionary.return_value = [self.word1, self.word2]
        mock_get_dict_or_404.return_value = self.dict1

        response = self.client.get(f'/words/{self.dict1.id}', **self.headers)

        self.assert200(response)

        words = json.loads(response.get_data())['words']

        self.assertEqual(len(words), 2)
        self.assertEqual(words[0]['word'], self.word1.word)
        self.assertEqual(words[1]['word'], self.word2.word)
        self.assertEqual(set((t['translation'] for t in words[0]['translations'])), set((
            self.word_translation1.translation, self.word_translation2.translation
        )))
        self.assertEqual(len(words[1]['translations']), 1)
        self.assertEqual(words[1]['translations'][0]['translation'], self.word_translation3.translation)


if __name__ == '__main__':
    unittest.main()
