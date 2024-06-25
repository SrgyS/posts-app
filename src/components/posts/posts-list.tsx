// import styles from './allPosts-list.module.css';
import { useEffect, useMemo, useState } from 'react';

import { Post } from './posts.slice';
import { postsApi } from './api';
import { usersApi } from '../users/api';

export function PostsList() {
    const [page, setPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [favoritePosts, setFavoritePosts] = useState<number[]>([]);
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');

    const handleChange = () => {
        setShowFavorites((prev) => !prev);
        setPage(1);
    };

    const {
        data: allPosts,
        isLoading: postsLoading,
        error: postsError,
    } = postsApi.useGetPostsQuery(selectedUserId);
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

    // const postsWithAuthors =
    //     allPosts?.map((post) => ({
    //         ...post,
    //         author: users?.find((user) => user.id === post.userId)?.name || '',
    //     })) || [];

    console.log('posts', postsWithAuthors);
    console.log('users', users);
    const handlePostsPerPageChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setPostsPerPage(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleAuthorChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const authorId = event.target.value ? Number(event.target.value) : null;
        setSelectedUserId(authorId);
        setPage(1);
    };
    const filteredData = () => {
        let filteredPosts = postsWithAuthors;
        if (searchText) {
            filteredPosts = filteredPosts.filter(
                (post) =>
                    post.title
                        .toLowerCase()
                        .indexOf(searchText.toLowerCase()) !== -1
            );
        }
        if (showFavorites) {
            filteredPosts = filteredPosts.filter((post) =>
                favoritePosts.includes(post.id)
            );
        }
        return filteredPosts;
    };

    const totalPages =
        postsPerPage === 0
            ? 1
            : Math.ceil(filteredData().length / postsPerPage);

    const paginatedPosts = () => {
        if (!allPosts) return [];
        if (postsPerPage === 0) return filteredData();
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return filteredData().slice(startIndex, endIndex);
    };

    const handleFavoriteChange = (postId: number) => {
        setFavoritePosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setPage(1);
    };

    if (postsLoading || usersLoading) {
        return <div>Loading...</div>;
    }
    if (postsError) {
        console.log('error', postsError.status);
        return (
            <div>
                Error loading posts: {postsError.toString()}{' '}
                {JSON.stringify(postsError.data)}
            </div>
        );
    }

    if (usersError) {
        return <div>Error loading users: {usersError.toString()}</div>;
    }

    return (
        <div>
            <header>
                <div>
                    <span>число постов на странице</span>
                    <select
                        value={postsPerPage}
                        onChange={handlePostsPerPageChange}
                    >
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                        <option value='0'>all</option>
                    </select>
                </div>
                <div>
                    <span>автор:</span>
                    <select
                        name='author'
                        value={selectedUserId ?? ''}
                        onChange={handleAuthorChange}
                    >
                        <option value=''>Выберите автора</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <search>
                        <input
                            type='text'
                            placeholder='Название поста'
                            value={searchText}
                            onChange={handleSearchTextChange}
                        />
                    </search>
                </div>
                <div>
                    <span>В избранном</span>
                    <input
                        type='checkbox'
                        checked={showFavorites}
                        onChange={handleChange}
                    />
                </div>
            </header>
            <h1>Posts</h1>

            <ul>
                {paginatedPosts()?.map((post: Post) => (
                    <PostItem
                        post={post}
                        key={post.id}
                        favoritePosts={favoritePosts}
                        onFavoriteChange={handleFavoriteChange}
                    />
                ))}
            </ul>
            <div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) =>
                        pageNum === 1 && totalPages <= 1 ? null : (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                disabled={pageNum === page}
                            >
                                {pageNum}
                            </button>
                        )
                )}
            </div>
        </div>
    );
}

const PostItem = ({
    post,
    favoritePosts,
    onFavoriteChange,
}: {
    post: Post;
    favoritePosts: number[];
    onFavoriteChange: (postId: number) => void;
}) => {
    if (!post) {
        return <div>No post</div>;
    }

    return (
        <li
            key={post.id}
            style={{ border: '1px solid black', marginBottom: '10px' }}
        >
            <input
                type='checkbox'
                checked={favoritePosts.includes(post.id)}
                onChange={() => onFavoriteChange(post.id)}
            />
            <h3>{post.title}</h3>
            <h5>{post.id}</h5>
            <p>{post.body}</p>
            <span>{post.author}</span>
            <div>
                <button>Комментарии</button>
                <button>Редактировать</button>
                <button>Удалить</button>
                <button>В избранное</button>
            </div>
        </li>
    );
};
