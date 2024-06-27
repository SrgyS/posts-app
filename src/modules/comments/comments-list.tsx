import { commentsApi } from './api';

export function CommentsList({ postId }: { postId: number }) {
    const {
        data: comments,
        isLoading: commentsLoading,
        error: commentsError,
    } = commentsApi.useGetCommentsByPostIdQuery(postId);
    if (commentsLoading) return <div>Loading...</div>;
    if (commentsError) return <div>Loading error</div>;

    return (
        <div>
            {comments?.map((comment) => (
                <div key={comment.id}>{comment.body}</div>
            ))}
        </div>
    );
}
