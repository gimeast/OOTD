import { useEffect, useState } from 'react';
import useUserStore from '../stores/useUserStore';
import { apiClient, API_ENDPOINTS } from '../api';
import type { User } from '../stores/useUserStore';

export function useAuthCheck() {
    const { login, logout } = useUserStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await apiClient<User>(API_ENDPOINTS.AUTH.ME, {
                    method: 'GET',
                });
                login(user);
            } catch {
                logout();
            } finally {
                setIsChecking(false);
            }
        };

        void checkAuth();
    }, []);

    return { isChecking };
}
