import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type User = {
    id: number;
    email: string;
    nickname: string;
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
        login: (user: User) => set({ isLoggedIn: true, user }),
        logout: () => set({ isLoggedIn: false, user: null }),
    }))
);

export default useUserStore;
