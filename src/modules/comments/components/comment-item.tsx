import { EmailIcon, PersonIcon } from '../../../assets/icons';

import { Comment } from '../comments.slice';
import s from './comment-item.module.css';

export const CommentItem = ({ comment }: { comment: Comment }) => {
    return (
        <div className={s.comment}>
            {!comment.id && <span>Нет комментариев</span>}
            <div className={s.userInfo}>
                <div className={s.infoRow}>
                    <PersonIcon width={12} height={12} /> {comment.name}
                </div>
                <div className={s.infoRow}>
                    <EmailIcon width={12} height={12} />
                    {comment.email}
                </div>
            </div>

            <div className={s.body}>{comment.body}</div>
        </div>
    );
};
