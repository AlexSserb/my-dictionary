from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies
)

from ..models import User, db

bp = Blueprint('accounts', __name__, url_prefix='/accounts')


def create_tokens(identity: str):
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    return { 'access_token': access_token, 'refresh_token': refresh_token }


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.get_by_identity(data['email'])

    if user is None or not user.check_password(data['password']):
        return jsonify({'message': 'Incorrect email or password'}), 400
    
    return jsonify(create_tokens(user.email))


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.get_by_identity(data['email']):
        return jsonify({'message': 'Email already registered'}), 409

    user = User(email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify(create_tokens(user.email))


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    return jsonify(create_tokens(identity))
    

@bp.route('/password-change', methods=['POST'])
@jwt_required()
def changePassword():
    data = request.get_json()
    user = User.get_by_identity(get_jwt_identity())

    if not user.check_password(data['oldPassword']):
        return jsonify({'message': 'Incorrect old password.'}), 400

    user.set_password(data['newPassword'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Password successfully changed.'}), 200
