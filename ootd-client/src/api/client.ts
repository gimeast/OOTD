import { API_BASE_URL } from './config';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
};

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials: 'include',
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            console.error('API 요청 실패:', result);
            throw new Error(result.message || result.error || 'API 요청에 실패했습니다.');
        }

        return result;
    } catch (error) {
        console.error('API 에러:', error);
        throw error;
    }
}
