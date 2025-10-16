export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        LOGOUT: '/api/v1/auth/logout',
        REFRESH_TOKEN: '/api/v1/auth/token/refresh',
        JOIN: '/api/v1/auth/join',
        CHECK_EMAIL: '/api/v1/auth/join/check/email',
        CHECK_NICKNAME: '/api/v1/auth/join/check/nickname',
        ME: '/api/v1/auth/me',
    },
    OOTD: {
        CREATE: '/api/v1/ootd',
        LIST: '/api/v1/ootd',
        IMAGE: { UPLOAD: '/api/v1/upload/images' },
        LIKE: '/api/v1/ootd/{ootdId}/like',
        BOOKMARK: '/api/v1/ootd/{ootdId}/bookmark',
    },
    MEMBER: {
        OOTD: {
            LIST: '/api/v1/member/{nickname}/posts',
            BOOKMARKED: '/api/v1/member/{nickname}/liked-posts',
            LIKED: '/api/v1/member/{nickname}/bookmarked-posts',
        },
    },
} as const;
