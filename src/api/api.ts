import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});
export const order = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

$api.interceptors.response.use((config) => {
    // Проверяем, что payload и accessToken существуют перед их использованием
    if (config.data.payload && config.data.payload.accessToken) {
        localStorage.setItem('token', config.data.payload.accessToken);
    }
    return config;
}, async (error) => {
    console.log(error.response);
    const originalRequest = error.config;

    // Обработка случая, когда токен просрочен или невалиден
    if (error.response.status === 401 && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
            // Получаем новый токен,
            const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
            // Убедждаемся, что accessToken действительно получен
            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return $api.request(originalRequest);
            }
        } catch (e) {
            console.log('Не удалось обновить токен, пользователь не авторизован');
        }
    }

    throw error;
});
