export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        CHECK_EMAIL: '/api/v1/auth/join/check/email',
    },
} as const;
