import type { User } from '../../stores/useUserStore';

export const mockUsers: (User & { password: string })[] = [
    {
        id: 1,
        email: 'user1@ootd.com',
        password: 'password1!',
        nickname: 'styleking',
        profileImageUrl: 'https://i.pravatar.cc/150?img=1',
        bio: '매일 새로운 스타일을 시도하는 패션 피플 👗',
        roleSet: [],
    },
    {
        id: 2,
        email: 'user2@ootd.com',
        password: 'password2@',
        nickname: 'fashionista',
        profileImageUrl: 'https://i.pravatar.cc/150?img=5',
        bio: '미니멀 패션을 사랑합니다 🖤',
        roleSet: [],
    },
    {
        id: 3,
        email: 'user3@ootd.com',
        password: 'password3#',
        nickname: 'dailylook',
        profileImageUrl: 'https://i.pravatar.cc/150?img=9',
        bio: '데일리룩 공유 계정입니다 ✨',
        roleSet: [],
    },
];
