import { Comment } from './comments.slice';
import { baseApi } from '../../api/baseApi';
import { providesList } from '../posts/api';

export const commentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCommentsByPostId: builder.query<Comment[], number>({
            query: (postId) => `/comments?postId=${postId}`,
            providesTags: (result) => providesList(result, 'Comment'),
        }),
    }),

    overrideExisting: true,
});
