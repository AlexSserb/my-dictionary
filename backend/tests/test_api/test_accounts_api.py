import json
import unittest
from unittest.mock import patch
from flask_jwt_extended import decode_token, create_refresh_token

from .. import BaseTestCaseWithoutDB
from app.database import User


class TestAccountsAPI(BaseTestCaseWithoutDB):
    """
    Tests for API from 'accounts' blueprint
    """

    @patch("app.database.User.register")
    @patch("app.database.User.get_by_identity")
    def test_success_registration(self, mock_get_by_identity, mock_register_user):
        username, password = "UserName", "mysecretpassword"
        user = User(username=username)
        user.set_password(password)
        mock_register_user.return_value = user
        mock_get_by_identity.return_value = None

        response = self.client.post(
            "/accounts/register", json={"username": username, "password": password}
        )

        self.assert200(response)

        data = json.loads(response.get_data())

        self.assertEqual(username, decode_token(data["accessToken"])["username"])
        self.assertEqual(username, decode_token(data["refreshToken"])["username"])

    @patch("app.database.User.check_password")
    @patch("app.database.User.get_by_identity")
    def test_success_login(self, mock_get_by_identity, mock_check_password):
        username, password = "UserName", "mysecretpassword"
        user = User(username=username)
        user.set_password(password)
        mock_get_by_identity.return_value = user
        mock_check_password.return_value = True

        response = self.client.post(
            "/accounts/login", json={"username": username, "password": password}
        )

        self.assert200(response)

        data = json.loads(response.get_data())

        self.assertEqual(username, decode_token(data["accessToken"])["username"])
        self.assertEqual(username, decode_token(data["refreshToken"])["username"])

    @patch("app.database.User.check_password")
    @patch("app.database.User.get_by_identity")
    def test_failed_login_ivalid_password(
        self, mock_get_by_identity, mock_check_password
    ):
        username, password = "UserName", "mysecretpassword"
        user = User(username=username)
        user.set_password(password)
        mock_get_by_identity.return_value = user
        mock_check_password.return_value = False

        response = self.client.post(
            "/accounts/login", json={"username": username, "password": password}
        )

        self.assert400(response)

        data = json.loads(response.get_data())

        self.assertEqual(data["message"], "Incorrect username or password")

    @patch("app.database.User.get_by_identity")
    def test_failed_login_user_not_found(self, mock_get_by_identity):
        mock_get_by_identity.return_value = None

        response = self.client.post(
            "/accounts/login",
            json={"username": "UserName", "password": "mysecretpassword"},
        )

        self.assert404(response)

        data = json.loads(response.get_data())

        self.assertEqual(data["message"], "User not found")

    def test_refresh_token(self):
        username = "UserName"
        payload = {"username": username}
        refresh_token = create_refresh_token(
            identity=username, additional_claims=payload
        )
        response = self.client.post(
            "/accounts/refresh", headers={"Authorization": f"Bearer {refresh_token}"}
        )

        self.assert200(response)

        data = json.loads(response.get_data())

        self.assertEqual(username, decode_token(data["accessToken"])["username"])
        self.assertEqual(username, decode_token(data["refreshToken"])["username"])


if __name__ == "__main__":
    unittest.main()
