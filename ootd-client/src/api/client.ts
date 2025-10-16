import { API_BASE_URL, API_ENDPOINTS } from './config';
import useUserStore from '../stores/useUserStore';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, string | number>; // URL 쿼리 파라미터
    skipTokenRefresh?: boolean; // 무한 루프 방지용
};

let isRefreshing = false; //토큰 갱신중인지 여부를 컨트롤하기 위한 용도
let refreshSubscribers: Array<() => void> = []; //토큰 갱신 중 들어온 요청건에 대해 큐에 적재하는 용도

function onTokenRefreshed() {
    //요청건 순차 실행
    refreshSubscribers.forEach(callback => callback());
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: () => void) {
    //요청건 적재
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

        onTokenRefreshed(); //토큰 갱신중 동시에 여러 API가 호출된 경우 콜백 함수들 실행됨
        return true;
    } catch (error) {
        // 토큰 갱신 실패는 조용히 처리
        return false;
    }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params, skipTokenRefresh = false } = options;

    const isFormData = body instanceof FormData;

    const config: RequestInit = {
        method,
        headers: isFormData
            ? headers // FormData일 때는 Content-Type을 자동으로 설정
            : {
                  'Content-Type': 'application/json',
                  ...headers,
              },
        credentials: 'include',
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

    // 쿼리 파라미터 처리
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });
        url += `?${searchParams.toString()}`;
    }

    try {
        const response = await fetch(url, config);
        const result = await response.json();

        if (!response.ok) {
            // 토큰 만료시 (리프레시 시도)
            if (response.status === 403 && !skipTokenRefresh) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const refreshSuccess = await refreshAccessToken();
                    isRefreshing = false;

                    if (refreshSuccess) {
                        return apiClient<T>(endpoint, { ...options, skipTokenRefresh: true }); //원래 요청 재시도
                    } else {
                        useUserStore.getState().logout(); //전역상태 변경

                        // /auth/me는 조용히 실패 처리 (useAuthCheck에서 사용)
                        if (endpoint.includes('/auth/me')) {
                            throw new Error('Not authenticated');
                        }

                        window.location.href = '/login';
                        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                    }
                } else {
                    // 토큰갱신중이면 토큰 갱신 후 다시 호출 할수있도록 동시 호출된 함수들은 적재한다.
                    return new Promise((resolve, reject) => {
                        addRefreshSubscriber(() => {
                            apiClient<T>(endpoint, { ...options, skipTokenRefresh: true })
                                .then(resolve)
                                .catch(reject);
                        });
                    });
                }
            }

            // /auth/me는 에러 로그 출력 안 함
            if (!endpoint.includes('/auth/me')) {
                console.error('API 요청 실패:', result);
            }
            throw new Error(result.message || result.error || 'API 요청에 실패했습니다.');
        }

        return result;
    } catch (error) {
        // /auth/me는 에러 로그 출력 안 함
        if (!endpoint.includes('/auth/me')) {
            console.error('API 에러:', error);
        }
        throw error;
    }
}
