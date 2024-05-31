from flask_testing import TestCase
from app import create_app as create_application
from app.database import db


class BaseTestCase(TestCase):
    '''
    Base test case for models testing
    '''
    def create_app(self):
        self.app = create_application('app.config.TestingConfig')

        with self.app.app_context():
            db.create_all()

        return self.app


class BaseTestCaseWithoutDB(TestCase):
    '''
    Base test case for views testing
    '''
    def create_app(self):
        self.app = create_application('app.config.TestingConfig')

        return self.app
