import axios from 'axios';
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async config => {
    config.timeout = 10000;
    config.headers.Authorization =
      `bearer ${localStorage.getItem('token')}`
    return config;
  },
  error => {
    Promise.reject(error)
  });

export default axiosInstance;