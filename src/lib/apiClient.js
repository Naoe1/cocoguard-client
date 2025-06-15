import Axios from 'axios';

export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function authRequestInterceptor(config) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

api.interceptors.request.use(authRequestInterceptor);
