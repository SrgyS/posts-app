import { Post } from '../modules/posts/posts.slice';
import { useMemo } from 'react';

type UseSortedPostsProps = {
    posts: Post[];
    sortField: string;
    sortDirection: string;
    favoritePosts: number[];
};

export const useSortedPosts = ({
    posts,
    sortField,
    sortDirection,
    favoritePosts,
}: UseSortedPostsProps) => {
    return useMemo(() => {
        return [...posts].sort((a, b) => {
            let compareA, compareB;
            switch (sortField) {
                case 'id':
                    compareA = a.id;
                    compareB = b.id;
                    break;
                case 'title':
                    compareA = a.title.toLowerCase();
                    compareB = b.title.toLowerCase();
                    break;
                case 'author':
                    compareA = a.author?.toLowerCase() ?? '';
                    compareB = b.author?.toLowerCase() ?? '';
                    break;
                case 'favorite':
                    compareA = favoritePosts.includes(a.id) ? 0 : 1;
                    compareB = favoritePosts.includes(b.id) ? 0 : 1;
                    break;
                default:
                    return 0;
            }
            if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [posts, sortField, sortDirection, favoritePosts]);
};
