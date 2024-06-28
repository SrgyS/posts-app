import { Button } from '../../../components/buttons/button';
import { Filter } from '../posts-page';
import { PostsFilter } from '../../../modules/posts/components/posts-filter';
import { User } from '../../../modules/users/users.slice';
import s from './header.module.css';

type HeaderProps = {
    users: User[];
    onAddPost: () => void;
    onFilterChange: (newFilters: Filter) => void;
    checkedPosts: number[];
    onDeleteClick: () => void;
    onFavoriteClick: () => void;
};

export const Header = ({
    users,
    onAddPost,
    onFilterChange,
    checkedPosts,
    onDeleteClick,
    onFavoriteClick,
}: HeaderProps) => {
    return (
        <header className={s.header}>
            <div className={s.btnContainer}>
                <Button onClick={onAddPost} className={s.secondaryButton}>
                    Добавить пост
                </Button>
                {checkedPosts.length > 0 && (
                    <div className={s.btnBox}>
                        <Button onClick={onDeleteClick} variant='secondary'>
                            Удалить
                        </Button>
                        <Button onClick={onFavoriteClick} variant='primary'>
                            В избранное
                        </Button>
                    </div>
                )}
            </div>
            <PostsFilter users={users || []} onFilterChange={onFilterChange} />
        </header>
    );
};
