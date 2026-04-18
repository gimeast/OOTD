import { http, HttpResponse } from 'msw';
import { mockHashtags } from '../data/hashtags';

export const hashtagHandlers = [
    http.get('/api/v1/hashtag/popular', () => {
        return HttpResponse.json(mockHashtags, { status: 200 });
    }),
];
