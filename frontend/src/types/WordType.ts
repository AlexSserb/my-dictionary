import WordTranslationType from "./WordTranslationType";

export interface WordType {
    id: string,
    word: string,
    translations: WordTranslationType[],
    dictionaryId: string,
    progress: number
}

export interface WordWithPointsType extends WordType {
    points: number
}

export interface WordTrainResultType {
    word_id: string,
    points: number
}
