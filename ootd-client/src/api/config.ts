export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        LOGOUT: '/api/v1/auth/logout',
        REGISTER: '/api/v1/auth/register',
    },
} as const;