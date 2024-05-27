from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required
)
from flask_pydantic import validate
from uuid import UUID

from ..database import User, Dictionary, Word, WordTranslation, Language, db
from ..schemes import ListOfDictionariesSchema, DictionarySchema, CreateDictionarySchema, LanguageSchema

bp = Blueprint('dictionaries', __name__, url_prefix='/dictionaries')


@bp.route('/', methods=['GET'])
@jwt_required()
def get_dictionaries():
    user = User.get_by_identity(get_jwt_identity())

    dicts = Dictionary.get_for_user(user)

    dicts = [DictionarySchema(
        id=d.id, 
        learned_language=LanguageSchema(id=d.learned_language.id, name=d.learned_language.name, code=d.learned_language.code), 
        target_language=LanguageSchema(id=d.target_language.id, name=d.target_language.name, code=d.target_language.code)
    ) for d in dicts]
    return jsonify(ListOfDictionariesSchema(dictionaries=dicts).model_dump(by_alias=True)), 200


@bp.route('/', methods=['POST'])
@jwt_required()
@validate()
def create_dict(body: CreateDictionarySchema):
    user = User.get_by_identity(get_jwt_identity())

    learned_language = db.get_or_404(Language, body.learned_language_id)
    target_language = db.get_or_404(Language, body.target_language_id)

    try:
        dictionary = Dictionary(user_id=user.id, learned_language_id=learned_language.id, target_language_id=target_language.id)
        db.session.add(dictionary)
        db.session.commit()

        return jsonify(DictionarySchema(
            id=dictionary.id,
            learned_language=LanguageSchema(id=dictionary.learned_language.id,
                name=dictionary.learned_language.name, code=dictionary.learned_language.code), 
            target_language=LanguageSchema(id=dictionary.target_language.id, 
                name=dictionary.target_language.name, code=dictionary.target_language.code)
        ).model_dump(by_alias=True)), 200

    except Exception as ex:
        db.session.rollback()
        return jsonify({'error': str(ex)}), 400


@bp.route('/<id>', methods=['DELETE'])
@jwt_required()
@validate()
def delete_dict(id: UUID):
    user = User.get_by_identity(get_jwt_identity())
    dictionary = db.get_or_404(Dictionary, id)

    if dictionary.user_id != user.id:
        return jsonify({'message': 'No permission to delete this object'}), 403

    db.session.delete(dictionary)
    db.session.commit()

    return jsonify({'message': 'Dictionary successfully deleted.'}), 200
