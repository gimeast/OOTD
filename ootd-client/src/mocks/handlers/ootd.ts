import { http, HttpResponse } from 'msw';
import { mockState } from '../state';
import { mockUploadedImages } from '../data/images';
import type { OotdItemType, OotdMutationType } from '../../types/ootd';
import type { PageResponseType } from '../../types/common';

const PAGE_SIZE = 12;

function buildPageResponse<T>(items: T[], page: number, size: number = PAGE_SIZE): PageResponseType<T> {
    const totalElements = items.length;
    const totalPages = Math.ceil(totalElements / size);
    const pageIndex = page - 1; // 1-indexed → 0-indexed
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

export const ootdHandlers = [
    http.get('/api/v1/ootd', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const sort = url.searchParams.get('sort') ?? 'id';

        let items = [...mockState.ootds];
        if (sort === 'like') {
            items.sort((a, b) => b.likeCount - a.likeCount);
        } else {
            items.sort((a, b) => b.ootdId - a.ootdId);
        }

        return HttpResponse.json(buildPageResponse(items, page));
    }),

    http.get('/api/v1/ootd/liked', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const liked = mockState.ootds.filter(o => o.isLiked);
        return HttpResponse.json(buildPageResponse(liked, page));
    }),

    http.get('/api/v1/ootd/search', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        const size = Number(url.searchParams.get('size') ?? PAGE_SIZE);
        const keyword = url.searchParams.get('keyword') ?? '';

        const filtered = keyword
            ? mockState.ootds.filter(o =>
                  o.hashtags.some(h => h.includes(keyword)) || o.content.includes(keyword)
              )
            : [...mockState.ootds];

        return HttpResponse.json(buildPageResponse(filtered, page, size));
    }),

    http.get('/api/v1/ootd/:ootdId/edit', ({ params }) => {
        const ootdId = Number(params.ootdId);
        const ootd = mockState.ootds.find(o => o.ootdId === ootdId);
        if (!ootd) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

        return HttpResponse.json({
            id: ootd.ootdId,
            content: ootd.content,
            images: (ootd.ootdImages ?? []).map((url, i) => ({ id: i + 1, imageUrl: url, imageOrder: i })),
            hashtags: ootd.hashtags,
            products: ootd.products,
        });
    }),

    http.get('/api/v1/ootd/:ootdId', ({ params }) => {
        const ootdId = Number(params.ootdId);
        const ootd = mockState.ootds.find(o => o.ootdId === ootdId);
        if (!ootd) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        return HttpResponse.json(ootd);
    }),

    http.post('/api/v1/ootd', async ({ request }) => {
        const body = await request.json() as OotdMutationType;
        const newOotd: OotdItemType = {
            ootdId: Date.now(),
            profileImageUrl: mockState.currentUser?.profileImageUrl ?? '',
            nickname: mockState.currentUser?.nickname ?? '',
            ootdImages: (body.images as Array<{ imageUrl: string }>).map(img => img.imageUrl),
            ootdImage: (body.images as Array<{ imageUrl: string }>)[0]?.imageUrl ?? '',
            isLiked: false,
            likeCount: 0,
            isBookmarked: false,
            content: body.content,
            hashtags: body.hashtags,
            products: body.products.map(p => ({ ...p, ogImage: '' })),
        };
        mockState.ootds.unshift(newOotd);
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.put('/api/v1/ootd/:ootdId', async ({ params, request }) => {
        const ootdId = Number(params.ootdId);
        const body = await request.json() as OotdMutationType;
        const idx = mockState.ootds.findIndex(o => o.ootdId === ootdId);
        if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

        mockState.ootds[idx] = {
            ...mockState.ootds[idx],
            content: body.content,
            hashtags: body.hashtags,
            ootdImages: (body.images as Array<{ imageUrl: string }>).map(img => img.imageUrl),
            ootdImage: (body.images as Array<{ imageUrl: string }>)[0]?.imageUrl ?? '',
            products: body.products.map(p => ({ ...p, ogImage: '' })),
        };
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.delete('/api/v1/ootd/:ootdId', ({ params }) => {
        const ootdId = Number(params.ootdId);
        mockState.ootds = mockState.ootds.filter(o => o.ootdId !== ootdId);
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.post('/api/v1/ootd/:ootdId/like', ({ params }) => {
        const ootdId = Number(params.ootdId);
        const idx = mockState.ootds.findIndex(o => o.ootdId === ootdId);
        if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

        const ootd = mockState.ootds[idx];
        mockState.ootds[idx] = {
            ...ootd,
            isLiked: !ootd.isLiked,
            likeCount: ootd.isLiked ? ootd.likeCount - 1 : ootd.likeCount + 1,
        };
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.post('/api/v1/ootd/:ootdId/bookmark', ({ params }) => {
        const ootdId = Number(params.ootdId);
        const idx = mockState.ootds.findIndex(o => o.ootdId === ootdId);
        if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

        mockState.ootds[idx] = {
            ...mockState.ootds[idx],
            isBookmarked: !mockState.ootds[idx].isBookmarked,
        };
        return HttpResponse.json({ isSuccess: true }, { status: 200 });
    }),

    http.post('/api/v1/upload/images', () => {
        const images = mockUploadedImages.map((url, i) => ({
            id: i + 1,
            imageUrl: url,
            imageOrder: i,
        }));
        return HttpResponse.json(images, { status: 200 });
    }),
];
