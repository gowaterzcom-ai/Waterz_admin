import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

interface CustomError {
  type: string;
  message: string;
  response?: any;
  status: number;
}
export const apiClient: AxiosInstance = axios.create({
  
  baseURL: 'https://www.backend.gowaterz.com', 
  // baseURL: 'http://localhost:8000', // local server
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
}
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Interceptor passed - Response:', response);
    return response;
  },
  (error: AxiosError) => {
    const statusCode = error.response?.status || 0;
    console.error('Interceptor caught error - Status:', statusCode);

    const customError: CustomError = {
      type: '',
      message: '',
      response: error.response,
      status: statusCode,
    };

    if (!error.response) {
      customError.type = 'NETWORK_ERROR';
      customError.message = 'Network error';
      return Promise.reject(customError);
    }

    switch (statusCode) {
      case 401:
        customError.type = 'AUTH_ERROR';
        customError.message = 'Unauthorized access';
        break;
      case 403:
        customError.type = 'FORBIDDEN_ERROR';
        customError.message = 'Forbidden access';
        break;
      case 409:
        customError.type = 'CONFLICT_ERROR';
        customError.message = 'Conflict: User already exists.';
        break;
      case 498:
        customError.type = 'SESSION_EXPIRED';
        customError.message = 'Session expired, please log in again';
        break;
      case 400:
        customError.type = 'VALIDATION_ERROR';
        customError.message = 'Validation error';
        break;
      case 404:
        customError.type = 'NOT_FOUND';
        customError.message = 'Not found';
        break;
      case 500:
        customError.type = 'SERVER_ERROR';
        customError.message = 'Server error';
        break;
      default:
        customError.type = 'UNEXPECTED_ERROR';
        customError.message = 'An unexpected error occurred';
        break;
    }

    return Promise.reject(customError);
  }
);

export const nonAuthApiClient: AxiosInstance = axios.create({
  baseURL: 'https://www.backend.gowaterz.com', 
  // baseURL: 'http://localhost:8000', // local server
  timeout: 20000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

nonAuthApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject({ type: 'NETWORK_ERROR', message: 'Network error' });
    }
    switch (error.response.status) {
      case 401:
        return Promise.reject({ type: 'AUTH_ERROR', message: 'Unauthorized access' });
      case 403:
        return Promise.reject({ type: 'FORBIDDEN_ERROR', message: 'Forbidden access' });
      case 400:
        return Promise.reject({ type: 'VALIDATION_ERROR', message: 'Validation error' });
      case 500:
        // @ts-ignore
        return Promise.reject({ type: 'SERVER_ERROR', message: error.response.data.message || 'Server error' });
      default:
        return Promise.reject({ type: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred' });
    }
  },
);

export default { apiClient, nonAuthApiClient };
