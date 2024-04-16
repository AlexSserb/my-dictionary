import axiosConfig from '../axiosConfig';
import axios from 'axios';

const API_URL = 'accounts';

class AuthService {
	axiosInstanceWithRefreshToken = axios.create({
		baseURL: process.env.REACT_APP_BASE_URL,
	});

	constructor() {
		this.axiosInstanceWithRefreshToken.interceptors.request.use((config) => {
			const authTokens = localStorage.getItem('authTokens');
			
			if (authTokens) {
				config.headers['Authorization'] = 'Bearer ' + JSON.parse(authTokens).refresh_token;
			}
		
			return config;
		});
	}

	login(email: string, password: string) {
		return axiosConfig.post(API_URL + '/login',
			{
				email: email,
				password: password
			});
	}

	register(email: string, password: string) {
		return axiosConfig.post(API_URL + '/register',
			{
				email: email,
				password: password 
			});
	}

	refresh() {
		return this.axiosInstanceWithRefreshToken.post(API_URL + '/refresh');
	}

	changePassword(oldPassword: string, newPassword: string) {
		return axiosConfig.post(API_URL + '/password-change', { 
		  oldPassword: oldPassword, 
		  newPassword: newPassword
		});
	}
}

const authService = new AuthService();
export default authService;