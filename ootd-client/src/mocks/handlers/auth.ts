import { http, HttpResponse } from 'msw';
import { mockUsers } from '../data/users';
import { mockState } from '../state';

export const authHandlers = [
    http.post('/api/v1/auth/login', async ({ request }) => {
        const body = await request.json() as { email: string; password: string };
        // password는 btoa로 인코딩되어 전송됨
        const decoded = atob(body.password);
        const user = mockUsers.find(u => u.email === body.email && u.password === decoded);

        if (!user) {
            return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;
        mockState.isAuthenticated = true;
        mockState.currentUser = userWithoutPassword;

        return HttpResponse.json({ user: userWithoutPassword }, { status: 200 });
    }),

    http.post('/api/v1/auth/logout', () => {
        mockState.isAuthenticated = false;
        mockState.currentUser = null;
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.post('/api/v1/auth/token/refresh', () => {
        if (mockState.isAuthenticated) {
            return HttpResponse.json({ isSuccess: true }, { status: 200 });
        }
        return HttpResponse.json({ message: '인증이 만료되었습니다.' }, { status: 401 });
    }),

    http.post('/api/v1/auth/join', () => {
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.post('/api/v1/auth/join/check/email', () => {
        return HttpResponse.json({ available: true }, { status: 200 });
    }),

    http.post('/api/v1/auth/join/check/nickname', () => {
        return HttpResponse.json({ available: true }, { status: 200 });
    }),

    http.get('/api/v1/auth/me', () => {
        if (!mockState.isAuthenticated || !mockState.currentUser) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return HttpResponse.json(mockState.currentUser, { status: 200 });
    }),
];
