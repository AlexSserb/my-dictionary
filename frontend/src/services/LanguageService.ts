import axiosConfig from '../axiosConfig';

const API_URL = 'languages/';

class LanguageService {
	getLanguages() {
		return axiosConfig.get(API_URL);
	}
}

const languageService = new LanguageService();
export default languageService;