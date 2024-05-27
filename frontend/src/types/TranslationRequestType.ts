import Language from "./LanguageType";
import WordTranslationType from "./WordTranslationType";

export interface TranslationRequest {
    languageFrom: Language,
    languageTo: Language,
    text: string
}

export interface TranslationResponse {
    translations: Array<WordTranslationType>
}
