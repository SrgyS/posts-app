import {
    ConfirmModal,
    useModal,
} from '../../components/confirm-modal/confirm-modal';
import { Post, addToFavorites } from './posts.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';

import { AddPostModal } from './add-post-modal';
import { Button } from '../../components/button/button';
import { Pagination } from '../../components/pagination/pagination';
import { PostItem } from './post-item';
import { PostsFilter } from './posts-filter';
import { RootState } from '../../app/store';
import { postsApi } from './api';
import s from './edit-post-form.module.css';
import styles from './posts-list.module.css';
import { useFilteredPosts } from '../../hooks/useFilteredPosts';
import { useSortedPosts } from '../../hooks/useSortedPosts';
import { usersApi } from '../users/api';

type Filter = {
    selectedUserId: number | null;
    searchText: string;
    showFavorites: boolean;
    sortField: string;
    sortDirection: string;
    postsPerPage: number;
};

export function PostsList() {
    const [page, setPage] = useState(1);
    const [checkedPosts, setCheckedPosts] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const dispatch = useDispatch();
    const handleAddPost = () => {
        setIsAddModalOpen(true);
    };

    const favoritePosts = useSelector((state: RootState) => state.favorites);
    const [deletePost, { isLoading: isDeleting }] =
        postsApi.useDeletePostMutation();
    const [filter, setFilter] = useState<Filter>({
        selectedUserId: null,
        searchText: '',
        showFavorites: false,
        sortField: 'id',
        sortDirection: 'asc',
        postsPerPage: 10,
    });

    const {
        data: allPosts,
        isLoading: postsLoading,
        error: postsError,
    } = postsApi.useGetPostsQuery(filter.selectedUserId);
    const {
        data: users,
        isLoading: usersLoading,
        error: usersError,
    } = usersApi.useGetUsersQuery();

    const postsWithAuthors = useMemo(() => {
        return (
            allPosts?.map((post) => ({
                ...post,
                author:
                    users?.find((user) => user.id === post.userId)?.name || '',
            })) || []
        );
    }, [allPosts, users]);

    console.log('posts', postsWithAuthors);
    console.log('users', users);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleCheckPost = (postId: number) => {
        setCheckedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    const filteredPosts = useFilteredPosts({
        posts: postsWithAuthors,
        searchText: filter.searchText,
        showFavorites: filter.showFavorites,
        favoritePosts,
    });

    const sortedPosts = useSortedPosts({
        posts: filteredPosts,
        sortField: filter.sortField,
        sortDirection: filter.sortDirection,
        favoritePosts,
    });
    const totalPages =
        filter.postsPerPage === 0
            ? 1
            : Math.ceil(filteredPosts.length / filter.postsPerPage);

    const deleteModal = useModal();
    const favoriteModal = useModal();

    const handleConfirmDelete = async () => {
        console.log('Deleting posts:', checkedPosts);

        try {
            // Создаем массив промисов для каждого удаляемого поста
            const deletePromises = checkedPosts.map((postId) =>
                deletePost(postId).unwrap()
            );

            // Ждем выполнения всех запросов на удаление
            await Promise.all(deletePromises);

            console.log('All selected posts deleted successfully');
            setCheckedPosts([]); // Очищаем список выбранных постов
        } catch (error) {
            console.error('Failed to delete some posts:', error);
            // Здесь вы можете добавить логику обработки ошибок,
            // например, показать пользователю сообщение об ошибке
        } finally {
            deleteModal.close();
        }
    };

    const handleConfirmFavorite = () => {
        dispatch(addToFavorites(checkedPosts));
        console.log('favorite', checkedPosts);
        setCheckedPosts([]);
        favoriteModal.close();
    };
    const paginatedPosts = () => {
        if (!allPosts) return [];

        if (filter.postsPerPage === 0) return sortedPosts;
        const startIndex = (page - 1) * filter.postsPerPage;
        const endIndex = startIndex + filter.postsPerPage;
        return sortedPosts.slice(startIndex, endIndex);
    };

    if (postsLoading || usersLoading) {
        return <div>Loading...</div>;
    }
    if (postsError) {
        console.log('error', postsError);
        return (
            <div>
                Error loading posts: {postsError.toString()}{' '}
                {JSON.stringify(postsError)}
            </div>
        );
    }

    if (usersError) {
        return <div>Error loading users: {usersError.toString()}</div>;
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.chekedBtn}>
                    <Button
                        onClick={handleAddPost}
                        className={s.secondaryButton}
                    >
                        Добавить пост
                    </Button>
                    {checkedPosts.length > 0 && (
                        <>
                            <Button
                                onClick={deleteModal.open}
                                className={s.secondaryButton}
                            >
                                Удалить
                            </Button>
                            <Button
                                onClick={favoriteModal.open}
                                className={s.primaryButton}
                            >
                                В избранное
                            </Button>
                        </>
                    )}
                </div>
                <PostsFilter
                    users={users || []}
                    onFilterChange={(newFilters) => {
                        setFilter(newFilters);
                        setPage(1);
                    }}
                />
            </div>

            <h1>Posts</h1>

            <ul>
                {paginatedPosts()?.map((post: Post) => (
                    <PostItem
                        post={post}
                        key={post.id}
                        checkedPosts={checkedPosts}
                        onCheckPost={handleCheckPost}
                        users={users || []}
                    />
                ))}
            </ul>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                message='Вы уверены, что хотите удалить выбранные посты?'
                onCancel={deleteModal.close}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
            <ConfirmModal
                isOpen={favoriteModal.isOpen}
                message='Вы уверены, что хотите добавить выбранные посты в избранное?'
                onCancel={favoriteModal.close}
                onConfirm={handleConfirmFavorite}
            />
            <Pagination
                totalPages={totalPages}
                page={page}
                onPageChange={handlePageChange}
            />
            <AddPostModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                users={users || []}
            />
        </div>
    );
}
