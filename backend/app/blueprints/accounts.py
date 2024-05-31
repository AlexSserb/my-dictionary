from flask import Blueprint, jsonify, request
import jwt
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies
)
from flask_pydantic import validate


from ..database import User, db
from ..schemes import LoginSchema, RegisterSchema, ChangePasswordSchema, TokenPairSchema

bp = Blueprint('accounts', __name__, url_prefix='/accounts')


def create_tokens(identity: str):
    payload = { 'username': identity }
    access_token = create_access_token(identity=identity, additional_claims=payload)
    refresh_token = create_refresh_token(identity=identity, additional_claims=payload)
    return TokenPairSchema(access_token=access_token, refresh_token=refresh_token)


@bp.route('/login', methods=['POST'])
@validate()
def login(body: LoginSchema):
    user = User.get_by_identity(body.username)

    if user is None:
        return jsonify({'message': 'User not found'}), 404

    if not user.check_password(body.password):
        return jsonify({'message': 'Incorrect username or password'}), 400
    
    return jsonify(create_tokens(user.username).model_dump(by_alias=True))


@bp.route('/register', methods=['POST'])
@validate()
def register(body: RegisterSchema):
    if User.get_by_identity(body.username):
        return jsonify({'message': 'Username already registered'}), 409

    user = User.register(body.username, body.password)

    return jsonify(create_tokens(user.username).model_dump(by_alias=True))


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@validate()
def refresh():
    identity = get_jwt_identity()
    return jsonify(create_tokens(identity).model_dump(by_alias=True))
    

@bp.route('/password-change', methods=['POST'])
@jwt_required()
@validate()
def change_password(body: ChangePasswordSchema):
    user = User.get_by_identity(get_jwt_identity())

    if not user or not user.check_password(body.old_password):
        return jsonify({'message': 'Incorrect old password.'}), 400

    user.set_password(body.new_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Password successfully changed.'}), 200
