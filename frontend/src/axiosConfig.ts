import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

instance.interceptors.request.use((config) => {
  const authTokens = localStorage.getItem('authTokens');
  
  if (authTokens) {
    config.headers['Authorization'] = 'Bearer ' + JSON.parse(authTokens).accessToken;
  }

  return config;
});

export default instance;