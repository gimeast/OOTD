import { API_BASE_URL, API_ENDPOINTS } from './config';
import useUserStore from '../stores/useUserStore';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    skipTokenRefresh?: boolean; // 무한 루프 방지용
};

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

function onTokenRefreshed() {
    refreshSubscribers.forEach(callback => callback());
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: () => void) {
    refreshSubscribers.push(callback);
}

async function refreshAccessToken(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            return false;
        }

        onTokenRefreshed();
        return true;
    } catch (error) {
        console.error('토큰 갱신 실패:', error);
        return false;
    }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, skipTokenRefresh = false } = options;

    const isFormData = body instanceof FormData;

    const config: RequestInit = {
        method,
        headers: isFormData
            ? headers // FormData일 때는 Content-Type을 자동으로 설정되게 함
            : {
                  'Content-Type': 'application/json',
                  ...headers,
              },
        credentials: 'include',
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            if (response.status === 403 && !skipTokenRefresh) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const refreshSuccess = await refreshAccessToken();
                    isRefreshing = false;

                    if (refreshSuccess) {
                        return apiClient<T>(endpoint, { ...options, skipTokenRefresh: true });
                    } else {
                        useUserStore.getState().logout();
                        window.location.href = '/login';
                        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                    }
                } else {
                    return new Promise((resolve, reject) => {
                        addRefreshSubscriber(() => {
                            apiClient<T>(endpoint, { ...options, skipTokenRefresh: true })
                                .then(resolve)
                                .catch(reject);
                        });
                    });
                }
            }

            console.error('API 요청 실패:', result);
            throw new Error(result.message || result.error || 'API 요청에 실패했습니다.');
        }

        return result;
    } catch (error) {
        console.error('API 에러:', error);
        throw error;
    }
}
