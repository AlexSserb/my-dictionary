from datetime import datetime, timezone, timedelta
import unittest
from app import create_app, db
from app.database import User
from app.config import Config
from .. import BaseTestCase


class TestUserModel(BaseTestCase):
    """
    Tests for User model
    """

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_set_and_check_user_password(self):
        user = User(username="UserName")
        user.set_password("mysecretpassword")
        db.session.add(user)

        self.assertTrue(user.check_password("mysecretpassword"))
        self.assertNotEqual(user.password_hash, "mysecretpassword")

    def test_get_by_identity(self):
        user1 = User(username="UserName")
        user1.set_password("mysecretpassword")
        user2 = User(username="AnotherUserName")
        user2.set_password("anotherpassword")
        db.session.add_all([user1, user2])

        self.assertEqual(user1.username, User.get_by_identity("UserName").username)
        self.assertEqual(
            user2.username, User.get_by_identity("AnotherUserName").username
        )
        self.assertIsNone(User.get_by_identity("NotExistedUserName"))

    def test_register_user(self):
        username, password = "TestUserName", "TestPassword"
        user = User.register(username, password)

        found_user = User.get_by_identity(username)

        self.assertIsNotNone(found_user)
        self.assertEqual(username, found_user.username)
        self.assertTrue(found_user.check_password(password))
