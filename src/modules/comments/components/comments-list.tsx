import { CommentItem } from './comment-item';
import { commentsApi } from '../api';
import s from './comments-list.module.css';
export function CommentsList({ postId }: { postId: number }) {
    const {
        data: comments,
        isLoading: commentsLoading,
        error: commentsError,
    } = commentsApi.useGetCommentsByPostIdQuery(postId);
    if (commentsLoading) return <div>Loading...</div>;
    if (commentsError) return <div>Loading error</div>;

    return (
        <div className={s.container}>
            {comments?.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
}
