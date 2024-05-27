import axiosConfig from '../axiosConfig';
import { TranslationRequest, TranslationResponse } from '../types/TranslationRequestType';

const API_URL = 'translations/';

class TranslationService {
	googleTranslate(translationRequest: TranslationRequest) {
		return axiosConfig.post<TranslationResponse>(API_URL + 'google', translationRequest);
	}
}

const translationService = new TranslationService();
export default translationService;