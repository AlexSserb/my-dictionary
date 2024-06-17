import WordTranslationType from "./WordTranslationType";

export interface WordType {
    id: string,
    word: string,
    translations: WordTranslationType[],
    dictionaryId: string,
    progress: number;
}

export interface WordWithPointsType extends WordType {
    points: number,
    isFinished: boolean;
}

export interface WordTrainResultType {
    wordId: string,
    points: number,
    isActive: boolean | undefined;
}

export interface WordIdWithTranslationType {
    wordId: string,
    translations: string,
    isFinished: boolean;
}
