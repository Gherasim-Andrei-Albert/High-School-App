import axios from 'axios';
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async config => {
    config.timeout = 100000;

    config.headers.Authorization =
      `bearer ${localStorage.getItem('token')}`;
    
    config.baseURL = process.env.REACT_APP_PUBLIC_API_URL;
      
    if(process.env.NODE_ENV === 'development') {
      switch (process.env.REACT_APP_SELECT_API_URL) {
        case 'local': {
          config.baseURL = process.env.REACT_APP_LOCAL_API_URL;
          break;
        }
      
        case 'lan': {
          config.baseURL = process.env.REACT_APP_LAN_API_URL;
          break;
        }
      
        case 'public': {
          config.baseURL = process.env.REACT_APP_PUBLIC_API_URL;
          break;
        }

        default: {
          config.baseURL = process.env.REACT_APP_LOCAL_API_URL;
          break;
        }
      }
    }
    
    return config;
  },
  error => {
    Promise.reject(error)
  });

export default axiosInstance;