import WordTranslationType from "./WordTranslationType";

export interface WordType {
    id: string,
    word: string,
    translations: WordTranslationType[],
    dictionaryId: string
}

export interface NewWordType {
    word: string,
    translations: WordTranslationType[]
}
