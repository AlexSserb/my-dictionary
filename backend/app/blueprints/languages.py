from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..database import Language

bp = Blueprint('languages', __name__, url_prefix='/languages')


@bp.route('/', methods=['GET'])
@jwt_required()
def get_languages():
    languages = Language.get_all()

    return jsonify([lang.to_json() for lang in languages]), 200
