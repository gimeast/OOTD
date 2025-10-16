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
        const checkAuth = async () => {
            try {
                const user = await apiClient<User>(API_ENDPOINTS.AUTH.ME, {
                    method: 'GET',
                });
                login(user);
            } catch (error) {
                logout();
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [location.pathname]);

    return { isChecking };
}
