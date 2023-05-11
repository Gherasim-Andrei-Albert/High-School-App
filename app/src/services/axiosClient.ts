import axios from 'axios';
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async config => {
    config.timeout = 100000;
    config.headers.Authorization =
      `bearer ${localStorage.getItem('token')}`;
    // config.baseURL = 'http://localhost:3000';
    config.baseURL = 'https://highschool-app-api.onrender.com';
    return config;
  },
  error => {
    Promise.reject(error)
  });

export default axiosInstance;