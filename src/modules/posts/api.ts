import { Post } from './posts.slice';
import { baseApi } from '../../api/baseApi';

export function providesList<R extends { id: number }[], T extends string>(
    resultsWithIds: R | undefined,
    tagType: T
) {
    return resultsWithIds
        ? [
              { type: tagType, id: 'LIST' },
              ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
          ]
        : [{ type: tagType, id: 'LIST' }];
}

export const postsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getPosts: build.query<Post[], number | null>({
            query: (userId) => `/posts${userId ? `?userId=${userId}` : ''}`,
            providesTags: (result) => providesList(result, 'Post'),
        }),
        updatePost: build.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `/posts/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            // invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
            async onQueryStarted(
                { id, ...patch },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('getPosts', null, (draft) => {
                        const post = draft.find((post) => post.id === id);
                        if (post) {
                            Object.assign(post, patch);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        addPost: build.mutation<Post, Omit<Post, 'id'>>({
            query: (newPost) => ({
                url: 'posts',
                method: 'POST',
                body: newPost,
            }),
            // invalidatesTags: [{ type: 'Post', id: 'LIST' }],
            async onQueryStarted(_newPost, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdPost } = await queryFulfilled;
                    dispatch(
                        postsApi.util.updateQueryData(
                            'getPosts',
                            null,
                            (draft) => {
                                draft.push(createdPost);
                            }
                        )
                    );
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        deletePost: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `posts/${id}`,
                    method: 'DELETE',
                };
            },
            // transformResponse: (response, meta, arg) => ({
            //     success: true,
            //     id: arg,
            // }),
            // invalidatesTags: (result, error, id) => [{ type: 'Post', id }],

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('getPosts', null, (draft) => {
                        const index = draft.findIndex((post) => post.id === id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});
