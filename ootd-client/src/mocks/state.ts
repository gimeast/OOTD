import type { User } from '../stores/useUserStore';
import type { OotdItemType } from '../types/ootd';
import { mockOotds } from './data/ootds';

type MockState = {
    isAuthenticated: boolean;
    currentUser: User | null;
    ootds: OotdItemType[];
};

export const mockState: MockState = {
    isAuthenticated: false,
    currentUser: null,
    ootds: [...mockOotds],
};
