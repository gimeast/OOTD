import { http, HttpResponse } from 'msw';
import { mockState } from '../state';
import { mockUsers } from '../data/users';
import { defaultProfileImageUrl, mockUploadedImages } from '../data/images';
import type { PageResponseType } from '../../types/common';
import type { OotdItemType } from '../../types/ootd';

const PAGE_SIZE = 20;

function buildPageResponse<T>(items: T[], page: number, size: number = PAGE_SIZE): PageResponseType<T> {
    const totalElements = items.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const pageIndex = page - 1;
    const start = pageIndex * size;
    const content = items.slice(start, start + size);

    return {
        content,
        pageable: {
            pageNumber: pageIndex,
            pageSize: size,
            sort: { empty: false, unsorted: true, sorted: false },
            offset: start,
            unpaged: false,
            paged: true,
        },
        last: page >= totalPages,
        totalElements,
        totalPages,
        first: page === 1,
        size,
        number: pageIndex,
        sort: { empty: false, unsorted: true, sorted: false },
        numberOfElements: content.length,
        empty: content.length === 0,
    };
}

export const memberHandlers = [
    http.get('/api/v1/member/:nickname/stats', ({ params }) => {
        const nickname = params.nickname as string;
        const user = mockUsers.find(u => u.nickname === nickname);

        return HttpResponse.json({
            nickname,
            profileImageUrl: user?.profileImageUrl ?? defaultProfileImageUrl,
            bio: user?.bio ?? '',
            followerCount: Math.floor(Math.random() * 200) + 10,
            followingCount: Math.floor(Math.random() * 100) + 5,
            postCount: mockState.ootds.filter(o => o.nickname === nickname).length,
        });
    }),

    http.get('/api/v1/member/:nickname/posts', ({ params, request }) => {
        const nickname = params.nickname as string;
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const size = Number(url.searchParams.get('size') ?? PAGE_SIZE);
        const posts = mockState.ootds.filter(o => o.nickname === nickname);
        return HttpResponse.json(buildPageResponse<OotdItemType>(posts, page, size));
    }),

    http.get('/api/v1/member/:nickname/liked-posts', ({ params, request }) => {
        const nickname = params.nickname as string;
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const size = Number(url.searchParams.get('size') ?? 12);
        const liked = mockState.ootds.filter(o => o.nickname === nickname && o.isLiked);
        return HttpResponse.json(buildPageResponse<OotdItemType>(liked, page, size));
    }),

    http.get('/api/v1/member/:nickname/bookmarked-posts', ({ params, request }) => {
        const nickname = params.nickname as string;
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const size = Number(url.searchParams.get('size') ?? 12);
        const bookmarked = mockState.ootds.filter(o => o.nickname === nickname && o.isBookmarked);
        return HttpResponse.json(buildPageResponse<OotdItemType>(bookmarked, page, size));
    }),

    http.patch('/api/v1/member/profile-img', () => {
        const newUrl = mockUploadedImages[0];
        if (mockState.currentUser) {
            mockState.currentUser = { ...mockState.currentUser, profileImageUrl: newUrl };
        }
        return HttpResponse.json({ profileImageUrl: newUrl }, { status: 200 });
    }),

    http.patch('/api/v1/member/profile-img/reset', () => {
        if (mockState.currentUser) {
            mockState.currentUser = { ...mockState.currentUser, profileImageUrl: defaultProfileImageUrl };
        }
        return HttpResponse.json({ profileImageUrl: defaultProfileImageUrl }, { status: 200 });
    }),

    http.patch('/api/v1/member/bio', ({ request }) => {
        const url = new URL(request.url);
        const bio = url.searchParams.get('bio') ?? '';
        if (mockState.currentUser) {
            mockState.currentUser = { ...mockState.currentUser, bio };
        }
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.get('/api/v1/member/search', ({ request }) => {
        const url = new URL(request.url);
        const keyword = url.searchParams.get('keyword') ?? '';
        const page = Number(url.searchParams.get('page') ?? 1);
        const size = Number(url.searchParams.get('size') ?? 10);

        const filtered = mockUsers
            .filter(u => u.nickname.includes(keyword))
            .map(u => ({
                idx: u.id,
                nickname: u.nickname,
                profileImageUrl: u.profileImageUrl,
                bio: u.bio,
            }));

        return HttpResponse.json(buildPageResponse(filtered, page, size));
    }),
];
