import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type User = {
    id: number;
    email: string;
    name: string;
    roleSet: [];
};

type UserStore = {
    isLoggedIn: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const useUserStore = create<UserStore>()(
    devtools(set => ({
        isLoggedIn: false,
        user: null,
        login: user => set({ isLoggedIn: true, user }),
        logout: () => set({ isLoggedIn: false, user: null }),
    }))
);

export default useUserStore;
