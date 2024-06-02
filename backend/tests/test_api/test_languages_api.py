import json
import unittest
from unittest.mock import patch
from flask_jwt_extended import create_access_token
from uuid import uuid4

from .. import BaseTestCaseWithoutDB
from app.database import *


class TestLanguagesAPI(BaseTestCaseWithoutDB):
    '''
    Tests for API from 'languages' blueprint
    '''

    def setUp(self):
        self.user = User(username='Alex')
        self.user.set_password('password')

        token = create_access_token(self.user.username, additional_claims={ 'username': self.user.username })
        self.headers = { 'headers' : { 'Authorization': f'Bearer {token}' }}

    def _set_test_data_get_all_languages(self):
        self.lang1 = Language(id=uuid4(), name='Language1', code='l1')
        self.lang2 = Language(id=uuid4(), name='Language2', code='l2')
        self.lang3 = Language(id=uuid4(), name='Language3', code='l3')

    @patch('app.database.Language.get_all')
    def test_get_all_languages(self, mock_get_all_langs):
        self._set_test_data_get_all_languages()

        mock_get_all_langs.return_value = [self.lang1, self.lang2, self.lang3]

        response = self.client.get(f'/languages/', **self.headers)

        self.assert200(response)

        data = json.loads(response.get_data())

        self.assertEqual(len(data['languages']), 3)
        self.assertEqual(set((l['name'] for l in data['languages'])), set((self.lang1.name, self.lang2.name, self.lang3.name)))


if __name__ == '__main__':
    unittest.main()
