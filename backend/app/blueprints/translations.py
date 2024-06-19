from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_pydantic import validate
from uuid import UUID, uuid4
from googletrans import Translator

from ..database import User, Dictionary, Word, WordTranslation, Language, db
from ..schemes.schemes import TranslateSchema, LanguageSchema, TranslationGoogleResult

bp = Blueprint("translations", __name__, url_prefix="/translations")


@bp.route("/google", methods=["POST"])
@jwt_required()
@validate()
def translate_google(body: TranslateSchema):
    translator = Translator()

    translation_result = translator.translate(
        body.text, src=body.language_from.code, dest=body.language_to.code
    )

    result_set_of_translations = []

    for group in translation_result.extra_data["possible-translations"]:
        for translation in group[2]:
            result_set_of_translations.append(
                {"id": uuid4(), "translation": translation[0]}
            )

    return (
        jsonify(
            TranslationGoogleResult(translations=result_set_of_translations).model_dump(
                by_alias=True
            )
        ),
        200,
    )
