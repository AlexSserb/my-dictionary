from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_pydantic import validate
from uuid import UUID

from ..database import User, Dictionary, Word, WordTranslation, Language, db
from ..schemes import (
    WordSchema,
    WordTranslationSchema,
    ListOfWordsSchema,
    ListOfTrainingResultSchema,
)

bp = Blueprint("words", __name__, url_prefix="/words")


@bp.route("/<dict_id>", methods=["GET"])
@jwt_required()
def get_words(dict_id: UUID):
    dictionary = db.get_or_404(Dictionary, dict_id)
    words = Word.get_for_dictionary(dictionary)

    words = [word.to_schema() for word in words]
    return jsonify(ListOfWordsSchema(words=words).model_dump(by_alias=True)), 200


@bp.route("/save", methods=["POST"])
@jwt_required()
@validate()
def save_word(body: WordSchema):
    try:
        if Word.get_by_id(body.id):
            Word.update(body)
        else:
            Word.create(body)

        return jsonify({"success": True}), 200

    except Exception as ex:
        return jsonify({"error": str(ex)}), 400


@bp.route("/<word_id>", methods=["DELETE"])
@jwt_required()
@validate()
def delete_word(word_id: UUID):
    word = db.get_or_404(Word, word_id)
    db.session.delete(word)
    db.session.commit()

    return jsonify({"success": True}), 200


@bp.route("/apply-training-results", methods=["POST"])
@jwt_required()
@validate()
def apply_training_results(body: ListOfTrainingResultSchema):
    try:
        Word.apply_training_results(body)

        return jsonify({"success": True}), 200

    except Exception as ex:
        return jsonify({"error": str(ex)}), 400
