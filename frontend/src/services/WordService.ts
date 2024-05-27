import { UUID } from 'crypto';
import axiosConfig from '../axiosConfig';
import { WordType } from '../types/WordType';

const API_URL = 'words/';

class WordService {
	getWords(dictId: UUID | null) {
		return axiosConfig.get(API_URL + dictId);
	}

	saveWord(word: WordType) {
		return axiosConfig.post(API_URL + 'save', word);
	}

	deleteWord(wordId: string) {
		return axiosConfig.delete(API_URL + wordId);
	}
}

const wordService = new WordService();
export default wordService;