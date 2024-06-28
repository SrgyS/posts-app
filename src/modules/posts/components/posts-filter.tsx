import {
    getPostsPerPageFromStorage,
    setPostsPerPageToStorage,
} from '../../../utils/local-storage';
import { useEffect, useState } from 'react';

import { User } from '../../users/users.slice';
import s from './posts-filter.module.css';

type PostsFilterProps = {
    users: User[];

    onFilterChange: (filters: {
        selectedUserId: number | null;
        searchText: string;
        showFavorites: boolean;
        sortField: string;
        sortDirection: string;
        postsPerPage: number;
    }) => void;
};

export const PostsFilter = ({
    users,

    onFilterChange,
}: PostsFilterProps) => {
    const [postsPerPage, setPostsPerPage] = useState(
        getPostsPerPageFromStorage()
    );
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');
    const [sortField, setSortField] = useState<string>('id');
    const [sortDirection, setSortDirection] = useState<string>('asc');

    const handlePostsPerPageChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newPostsPerPage = Number(event.target.value);
        setPostsPerPage(newPostsPerPage);
        onFilterChange({
            selectedUserId,
            searchText,
            showFavorites,
            sortField,
            sortDirection,
            postsPerPage: newPostsPerPage,
        });
    };

    const handleAuthorChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const authorId = event.target.value ? Number(event.target.value) : null;
        setSelectedUserId(authorId);
        onFilterChange({
            selectedUserId: authorId,
            searchText,
            showFavorites,
            sortField,
            sortDirection,
            postsPerPage,
        });
    };

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);
        onFilterChange({
            selectedUserId,
            searchText: text,
            showFavorites,
            sortField,
            sortDirection,
            postsPerPage,
        });
    };

    const handleShowFavoritesChange = (show: boolean) => {
        setShowFavorites(show);
        onFilterChange({
            selectedUserId,
            searchText,
            showFavorites: show,
            sortField,
            sortDirection,
            postsPerPage,
        });
    };
    const handleSortFieldChange = (field: string) => {
        setSortField(field);
        onFilterChange({
            selectedUserId,
            searchText,
            showFavorites,
            sortField: field,
            sortDirection,
            postsPerPage,
        });
    };
    const handleSortDirectionChange = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        onFilterChange({
            selectedUserId,
            searchText,
            showFavorites,
            sortField,
            sortDirection: newDirection,
            postsPerPage,
        });
    };
    useEffect(() => {
        setPostsPerPageToStorage(postsPerPage);
    }, [postsPerPage]);
    return (
        <div className={s.filterContainer}>
            <div className={s.filterRow}>
                <search className={s.filterSearch}>
                    <input
                        className={s.filterInput}
                        type='text'
                        placeholder='Поиск по заголовку'
                        value={searchText}
                        onChange={handleSearchTextChange}
                    />
                </search>
                <div className={s.filterItem}>
                    <select
                        className={s.filterSelect}
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
            </div>
            <div className={s.filterRow}>
                <div className={s.filterItem}>
                    <span className={s.filterLabel}>Постов на странице</span>
                    <select
                        className={s.filterSelect}
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
                <div className={s.filterItem}>
                    <span className={s.filterLabel}>В избранном</span>
                    <input
                        className={s.filterCheckbox}
                        type='checkbox'
                        checked={showFavorites}
                        onChange={(e) =>
                            handleShowFavoritesChange(e.target.checked)
                        }
                    />
                </div>
            </div>

            <div className={s.filterItem}>
                <span className={s.filterLabel}>Сортировка по:</span>
                <select
                    className={s.filterSelect}
                    value={sortField}
                    onChange={(e) => handleSortFieldChange(e.target.value)}
                >
                    <option value='id'>ID</option>
                    <option value='title'>Название</option>
                    <option value='author'>Имя пользователя</option>
                    <option value='favorite'>Избранные</option>
                </select>
                <button
                    className={s.sortButton}
                    onClick={handleSortDirectionChange}
                >
                    {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
            </div>
        </div>
    );
};
