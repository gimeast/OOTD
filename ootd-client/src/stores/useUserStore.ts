import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type User = {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    bio: string;
    roleSet: [];
};

type UserStore = {
    isLoggedIn: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    updateProfileImageUrl: (profileImageUrl: string) => void;
};

const useUserStore = create<UserStore>()(
    devtools(set => ({
        isLoggedIn: false,
        user: null,
        login: (user: User) => set({ isLoggedIn: true, user }),
        logout: () => set({ isLoggedIn: false, user: null }),
        updateProfileImageUrl: (profileImageUrl: string) =>
            set(state => ({
                user: state.user ? { ...state.user, profileImageUrl } : null,
            })),
    }))
);

export default useUserStore;
