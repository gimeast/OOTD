import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useUserStore from '../stores/useUserStore';
import { apiClient, API_ENDPOINTS } from '../api';
import type { User } from '../stores/useUserStore';

export function useAuthCheck() {
    const { login, logout } = useUserStore();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // 권환체크가 필요없는 부분
        if (
            location.pathname === '/' ||
            location.pathname === '/search' ||
            location.pathname === '/login' ||
            location.pathname === '/join'
        ) {
            setIsChecking(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const user = await apiClient<User>(API_ENDPOINTS.AUTH.ME, {
                    method: 'GET',
                });
                login(user);
            } catch (error) {
                console.error(error);
                logout();
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [location.pathname]);

    return { isChecking };
}
