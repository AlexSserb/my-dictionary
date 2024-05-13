import { UUID } from 'crypto';
import axiosConfig from '../axiosConfig';

const API_URL = 'dictionaries/';

class DictionaryService {
	getDictionaries() {
		return axiosConfig.get(API_URL);
	}

	createDictionary(learnedLanguageId: UUID | undefined, targetLanguageId: UUID | undefined) {
		return axiosConfig.post(API_URL, {
            learnedLanguageId: learnedLanguageId,
            targetLanguageId: targetLanguageId
        });
	}

	deleteDictionary(id: UUID) {
        return axiosConfig.delete(API_URL + id);
    }
}

const dictionaryService = new DictionaryService();
export default dictionaryService;