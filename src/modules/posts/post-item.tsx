import { Post, addToFavorites, removeFromFavorites } from './posts.slice';
import { useDispatch, useSelector } from 'react-redux';

import { CommentsList } from '../comments/comments-list';
import { EditPostForm } from './edit-post-form';
import { IconButton } from '../../components/button/icon-button';
import { RootState } from '../../app/store';
import { User } from '../users/users.slice';
import { postsApi } from './api';
import s from './posts-list.module.css';
import { useState } from 'react';

export const PostItem = ({
    post,
    checkedPosts,
    onCheckPost,

    users,
}: {
    post: Post;
    checkedPosts: number[];
    users: User[];
    onCheckPost: (postId: number) => void;
}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const dispatch = useDispatch();
    const favoritePosts = useSelector((state: RootState) => state.favorites);

    const handleFavoriteToggle = (postId: number) => {
        if (favoritePosts.includes(postId)) {
            dispatch(removeFromFavorites([postId]));
        } else {
            dispatch(addToFavorites([postId]));
        }
    };
    if (!post) {
        return <div>No post</div>;
    }

    const [deletePost, { isLoading: isDeleting }] =
        postsApi.useDeletePostMutation();

    const handleDeletePost = async (postId: number) => {
        try {
            await deletePost(postId).unwrap();
            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Failed to delete the post:', error);
        }
    };

    const [updatePost] = postsApi.useUpdatePostMutation();

    const handleUpdatePost = async (updatedPost: Post) => {
        try {
            await updatePost(updatedPost).unwrap();
            setIsEdit(false);
            console.log('Updated post successfully');
        } catch (error) {
            console.error('Failed to update the post:', error);
        }
    };
    const onCancel = () => setIsEdit(false);
    const onCommentsToggle = () => setShowComments(!showComments);

    return (
        <li
            className={
                favoritePosts.includes(post.id)
                    ? `${s.postItem} + ${s.active}`
                    : s.postItem
            }
            key={post.id}
        >
            {isEdit ? (
                <EditPostForm
                    post={post}
                    users={users}
                    onSave={handleUpdatePost}
                    onCancel={onCancel}
                    isAdd={false}
                />
            ) : (
                <>
                    <div className={s.postHeader}>
                        <input
                            type='checkbox'
                            checked={checkedPosts.includes(post.id)}
                            onChange={() => onCheckPost(post.id)}
                        />
                        <h2 className={s.postTitle}>{post.title}</h2>
                        <h5 className={s.postId}>{post.id}</h5>
                    </div>
                    <p className={s.postBody}>{post.body}</p>
                    <p className={s.postAuthor}>{post.author}</p>
                    <div className={s.postActions}>
                        <IconButton
                            action='edit'
                            onClick={() => setIsEdit(!isEdit)}
                            label='редактировать'
                        />
                        <IconButton
                            action='comment'
                            onClick={onCommentsToggle}
                            label='комментарии'
                        />
                        <IconButton
                            action='delete'
                            onClick={() => handleDeletePost(post.id)}
                            label='Удалить'
                            disabled={isDeleting}
                        />
                        <IconButton
                            action='favorite'
                            onClick={() => handleFavoriteToggle(post.id)}
                            label='В избранное'
                            className={
                                favoritePosts.includes(post.id) ? s.active : ''
                            }
                        />
                    </div>
                    {showComments ? <CommentsList postId={post.id} /> : null}
                </>
            )}
        </li>
    );
};
