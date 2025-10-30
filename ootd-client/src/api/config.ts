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
        EDIT: '/api/v1/ootd/{ootdId}',
        LIST: '/api/v1/ootd',
        DETAIL: '/api/v1/ootd/{ootdId}',
        IMAGE: { UPLOAD: '/api/v1/upload/images' },
        LIKE: '/api/v1/ootd/{ootdId}/like',
        LIKED: '/api/v1/ootd/liked',
        BOOKMARK: '/api/v1/ootd/{ootdId}/bookmark',
        SEARCH: '/api/v1/ootd/search',
        EDIT_DETAIL: '/api/v1/ootd/{ootdId}/edit',
    },
    MEMBER: {
        STATS: '/api/v1/member/{nickname}/stats',
        OOTD: {
            LIST: '/api/v1/member/{nickname}/posts',
            LIKED: '/api/v1/member/{nickname}/liked-posts',
            BOOKMARKED: '/api/v1/member/{nickname}/bookmarked-posts',
        },
        PROFILE_IMG: '/api/v1/member/profile-img',
        PROFILE_IMG_RESET: '/api/v1/member/profile-img/reset',
        BIO: '/api/v1/member/bio',
        SEARCH: '/api/v1/member/search',
    },
    HASHTAG: {
        POPULAR: '/api/v1/hashtag/popular',
    },
} as const;
