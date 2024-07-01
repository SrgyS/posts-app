import { Post, addToFavorites, removeFromFavorites } from '../posts.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { CommentsList } from '../../comments/components/comments-list';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';
import { EditPostForm } from './edit-post-form';
import { Error } from '../../../components/error/error';
import { IconButton } from '../../../components/buttons/icon-button';
import { RootState } from '../../../app/store';
import { User } from '../../users/users.slice';
import { postsApi } from '../api';
import s from './posts.module.css';
import { useModal } from '../../../hooks/useModal';

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
    const [showDeleteError, setShowDeleteError] = useState<boolean>(false);
    const [showUpdateError, setShowUpdateError] = useState<boolean>(false);

    const dispatch = useDispatch();
    const favoritePosts = useSelector((state: RootState) => state.favorites);

    const handleFavoriteToggle = (postId: number) => {
        if (favoritePosts.includes(postId)) {
            dispatch(removeFromFavorites([postId]));
        } else {
            dispatch(addToFavorites([postId]));
        }
    };

    const [deletePost, { isLoading: isDeleting }] =
        postsApi.useDeletePostMutation();

    const handleDeletePost = async (postId: number) => {
        try {
            await deletePost(postId).unwrap();
        } catch (error) {
            setShowDeleteError(true);
            deleteModal.close();
        }
    };
    const [updatePost] = postsApi.useUpdatePostMutation();

    const handleUpdatePost = async (updatedPost: Post) => {
        try {
            await updatePost(updatedPost).unwrap();
            setIsEdit(false);
        } catch (error) {
            setShowUpdateError(true);
            setIsEdit(false);
        }
    };
    const onCancel = () => setIsEdit(false);
    const onCommentsToggle = () => setShowComments(!showComments);

    const deleteModal = useModal();
    useEffect(() => {
        if (showDeleteError) {
            const timer = setTimeout(() => {
                setShowDeleteError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showDeleteError]);

    useEffect(() => {
        if (showUpdateError) {
            const timer = setTimeout(() => {
                setShowUpdateError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showUpdateError]);

    if (!post) {
        return <div>No post</div>;
    }

    return (
        <>
            {showUpdateError && (
                <div className={s.errorMessage}>
                    <Error message='Failed to update the post' />
                </div>
            )}
            {showDeleteError && (
                <div className={s.errorMessage}>
                    <Error message='Failed to delete the post' />
                </div>
            )}
            <li
                className={
                    favoritePosts.includes(post.id)
                        ? `${s.postItem} + ${s.active}`
                        : s.postItem
                }
                key={post.id}
            >
                {isEdit ? (
                    <>
                        <EditPostForm
                            post={post}
                            users={users}
                            onSave={handleUpdatePost}
                            onCancel={onCancel}
                            isAdd={false}
                        />
                    </>
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
                                className={showComments ? s.active : ''}
                            />
                            <IconButton
                                action='delete'
                                onClick={deleteModal.open}
                                label='Удалить'
                                disabled={isDeleting}
                            />
                            <IconButton
                                action='favorite'
                                onClick={() => handleFavoriteToggle(post.id)}
                                label='В избранное'
                                className={
                                    favoritePosts.includes(post.id)
                                        ? s.active
                                        : ''
                                }
                            />
                        </div>

                        <ConfirmModal
                            isOpen={deleteModal.isOpen}
                            message='Вы уверены, что хотите удалить выбранный пост?'
                            onCancel={deleteModal.close}
                            onConfirm={() => handleDeletePost(post.id)}
                            isLoading={isDeleting}
                        />
                        {showComments ? (
                            <CommentsList postId={post.id} />
                        ) : null}
                    </>
                )}
            </li>
        </>
    );
};
