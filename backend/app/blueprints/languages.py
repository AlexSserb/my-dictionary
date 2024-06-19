from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..database import Language
from ..schemes.schemes import ListOfLanguagesSchema, LanguageSchema

bp = Blueprint("languages", __name__, url_prefix="/languages")


@bp.route("/", methods=["GET"])
@jwt_required()
def get_languages():
    languages = Language.get_all()

    languages = [
        LanguageSchema(id=lang.id, name=lang.name, code=lang.code) for lang in languages
    ]

    return (
        jsonify(ListOfLanguagesSchema(languages=languages).model_dump(by_alias=True)),
        200,
    )
