import WordTranslationType from "../types/WordTranslationType";

export default function translationsInLine(translations: WordTranslationType[]) {
    return translations.map(translation => translation.translation).join(', ');
}
