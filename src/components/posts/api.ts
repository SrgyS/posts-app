import { Post } from './posts.slice';
import { baseApi } from '../../api/api';

export const postsApi = baseApi.injectEndpoints({
    endpoints: (create) => ({
        getPosts: create.query<Post[], number | null>({
            query: (userId) => `/posts${userId ? `?userId=${userId}` : ''}`,
            providesTags: ['Posts'],
        }),
        // getPostsByUserId: create.query<Post[], number>({
        //     query: (userId) => `/posts?userId=${userId}`,
        //     providesTags: ['Posts'],
        // }),
    }),

    overrideExisting: true,
});

// endpoints: (build) => ({
//     +        getPosts: build.query<Post[], { page: number; limit: number }>({
//     +            query: ({ page, limit }) => ({
//     +                url: 'posts',
//     +                params: {
//     +                    _page: page,
//     +                    _limit: limit,
//     +                },
//     +            }),
//     +            providesTags: (_result, _error, { page, limit }) =>
//     +                ['Posts', { type: 'Posts', page, limit }],
