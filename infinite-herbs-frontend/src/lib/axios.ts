import axios, {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import Cookies from 'js-cookie';

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = Cookies.get('accessToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                    refreshToken,
                });

                Cookies.set('access_token', data.accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
