import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';

import { AddPostModal } from '../../modules/posts/components/add-post-modal';
import { Button } from '../../components/buttons/button';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';
import { Error } from '../../components/error/error';
import { Header } from '../../pages/posts-page/components/header';
import { Pagination } from '../../components/pagination/pagination';
import { PostsSection } from '../../pages/posts-page/components/posts-section';
import { RootState } from '../../app/store';
import { addToFavorites } from '../../modules/posts/posts.slice';
import { postsApi } from '../../modules/posts/api';
import s from './posts-page.module.css';
import { useFilteredPosts } from '../../hooks/useFilteredPosts';
import { useModal } from '../../hooks/useModal';
import { useSortedPosts } from '../../hooks/useSortedPosts';
import { usersApi } from '../../modules/users/api';

export type Filter = {
    selectedUserId: number | null;
    searchText: string;
    showFavorites: boolean;
    sortField: string;
    sortDirection: string;
    postsPerPage: number;
};

export function PostsPage() {
    const [page, setPage] = useState(1);
    const [checkedPosts, setCheckedPosts] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showError, setShowError] = useState<string | null>(null);

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
        try {
            const deletePromises = checkedPosts.map((postId) =>
                deletePost(postId).unwrap()
            );
            await Promise.all(deletePromises);
            setCheckedPosts([]);
        } catch (error) {
            setShowError('Failed to delete some posts');
        } finally {
            deleteModal.close();
        }
    };

    const handleConfirmFavorite = () => {
        dispatch(addToFavorites(checkedPosts));

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
        return <div className={s.loader}>Loading...</div>;
    }
    if (postsError) {
        return (
            <div className={s.errorContainer}>
                <Error message='Error loading posts' />

                <Button
                    variant='primary'
                    onClick={() => window.location.reload()}
                >
                    На главную
                </Button>
            </div>
        );
    }

    if (usersError) {
        return <Error message='Error loading users' />;
    }

    return (
        <div className={s.container}>
            <Header
                onAddPost={handleAddPost}
                users={users || []}
                onFilterChange={(newFilters) => {
                    setFilter(newFilters);
                    setPage(1);
                }}
                checkedPosts={checkedPosts}
                onDeleteClick={deleteModal.open}
                onFavoriteClick={favoriteModal.open}
            />
            <PostsSection
                posts={paginatedPosts()}
                checkedPosts={checkedPosts}
                onCheckPost={handleCheckPost}
                users={users || []}
            />

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
            {showError && <Error message={showError} />}
        </div>
    );
}
